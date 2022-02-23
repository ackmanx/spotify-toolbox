import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { _Artist, buildArtist, mArtist } from '../../../mongoose/Artist'
import { mUser } from '../../../mongoose/User'
import { Many } from '../../../mongoose/types'
import { isViewed, removeDuplicates } from '../../../utils/array'
import { SpotifyHelper } from '../../../utils/server/spotify-helper'

type ResBody = Record<string, Many<_Artist>> | { success: boolean; message?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResBody>) {
  const session = await getSession({ req })
  await dbConnect()

  const user = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    res
      .status(401)
      .send({ success: false, message: 'User not found in database. How are you even logged in?' })
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

  const artistsByGenre = mFollowedArtistsInDB.reduce(
    (genres: Record<string, Many<_Artist>>, artist) => {
      if (!genres[artist.genre]) {
        genres[artist.genre] = []
      }

      const hasUnviewedAlbums =
        artist.albumIDs.length === 0 ||
        artist.albumIDs.some((albumId) => !isViewed(user.viewedAlbums, artist.id, albumId))

      if (hasUnviewedAlbums) {
        genres[artist.genre].push(artist)
      }

      return genres
    },
    {}
  )

  res.send(artistsByGenre)
}
