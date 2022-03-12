import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../../lib/db'
import { _Album, mAlbum } from '../../../../mongoose/Album'
import { _Artist, buildArtist, mArtist } from '../../../../mongoose/Artist'
import { _User, mUser, sendUserNotFoundError } from '../../../../mongoose/User'
import { Many, One } from '../../../../mongoose/types'
import { removeDuplicates } from '../../../../utils/array'
import { SpotifyHelper } from '../../../../utils/server/spotify-helper'

/*
 * Update the current user's list of followed artists
 * - Query Spotify for a new list
 * - Create new shell DB records for any new artists
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  await dbConnect()

  const user: One<_User> = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    sendUserNotFoundError(res)
    return
  }

  const sFollowedArtists = await SpotifyHelper.followedArtists(req)

  user.followedArtists = sFollowedArtists.map((artist) => artist.id)

  await user.save()

  const mFollowedArtistsInDB: Many<_Artist> = await mArtist.find({
    id: { $in: user.followedArtists },
  })

  const followedArtistsInDB_IDs: string[] = mFollowedArtistsInDB.map((artist) => artist.id)

  const mNewArtistsToSaveToDB: Many<_Artist> = removeDuplicates(
    sFollowedArtists,
    followedArtistsInDB_IDs
  ).map((artist) => buildArtist(artist))

  await mArtist.bulkSave(mNewArtistsToSaveToDB)

  res.send({ success: true })
}
