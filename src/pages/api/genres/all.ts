import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { _Artist, buildArtist, mArtist } from '../../../mongoose/Artist'
import { mUser, sendUserNotFoundError } from '../../../mongoose/User'
import { Many } from '../../../mongoose/types'
import { isViewed, removeDuplicates } from '../../../utils/array'
import { SpotifyHelper } from '../../../utils/server/spotify-helper'

type ResBody = string[] | { success: boolean; message?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResBody>) {
  const session = await getSession({ req })
  await dbConnect()

  const user = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    sendUserNotFoundError(res)
    return
  }

  let mFollowedArtistsInDB: Many<_Artist>

  if (user.isNewUser) {
    const sFollowedArtists = await SpotifyHelper.followedArtists(req)

    user.followedArtists = sFollowedArtists.map((artist) => artist.id)
    user.isNewUser = false

    await user.save()

    mFollowedArtistsInDB = await mArtist.find({
      id: { $in: user.followedArtists },
    })

    const followedArtistsInDB_IDs = mFollowedArtistsInDB.map((artist) => artist.id)

    const mNewArtistsToSaveToDB: Many<_Artist> = removeDuplicates(
      sFollowedArtists,
      followedArtistsInDB_IDs
    ).map((artist) => buildArtist(artist))

    await mArtist.bulkSave(mNewArtistsToSaveToDB)

    mFollowedArtistsInDB = mFollowedArtistsInDB.concat(mNewArtistsToSaveToDB)
  } else {
    mFollowedArtistsInDB = await mArtist.find({
      id: { $in: user.followedArtists },
    })
  }

  const genres = mFollowedArtistsInDB.reduce((genres: string[], artist) => {
    const hasUnviewedAlbums =
      artist.albumIDs.length === 0 ||
      artist.albumIDs.some((albumId) => !isViewed(user.viewedAlbums, artist.id, albumId))

    if (hasUnviewedAlbums && !genres.includes(artist.genre)) {
      genres.push(artist.genre)
    }

    return genres
  }, [])

  genres.sort()

  res.send(genres)
}
