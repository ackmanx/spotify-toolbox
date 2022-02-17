import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { _Album, mAlbum } from '../../../mongoose/Album'
import { _Artist, buildArtist, mArtist } from '../../../mongoose/Artist'
import { mUser } from '../../../mongoose/User'
import { Many } from '../../../mongoose/types'
import { GetAll } from '../../../utils/server/spotify-web-api'

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
    const sFollowedArtists = await GetAll.followedArtists(req)

    user.followedArtists = sFollowedArtists.map((artist) => artist.id)
    user.isNewUser = false

    await user.save()

    mFollowedArtistsInDB = await mArtist.find({
      id: { $in: user.followedArtists },
    })

    const followedArtistsInDB_IDs = mFollowedArtistsInDB.map((artist) => artist.id)

    const sNewArtistsToSaveToDB = sFollowedArtists.filter(
      (artist) => !followedArtistsInDB_IDs.includes(artist.id)
    )

    const mNewArtistsToSaveToDB: Many<_Artist> = sNewArtistsToSaveToDB.map((artist) =>
      buildArtist(artist)
    )
    await mArtist.bulkSave(mNewArtistsToSaveToDB)
    mFollowedArtistsInDB = mFollowedArtistsInDB.concat(mNewArtistsToSaveToDB)
  } else {
    mFollowedArtistsInDB = await mArtist.find({
      id: { $in: user.followedArtists },
    })
  }

  const artistsWithUnviewedAlbums: Many<_Artist> = []

  // Async-friendly filter
  for (let i = 0; mFollowedArtistsInDB.length > i; i++) {
    const artist = mFollowedArtistsInDB[i]
    const albums: Many<_Album> = await mAlbum.find({ id: { $in: artist.albumIDs } })

    const hasUnviewedAlbums =
      artist.albumIDs.length === 0 || albums.some((album) => !user?.viewedAlbums.includes(album.id))

    if (hasUnviewedAlbums) {
      artistsWithUnviewedAlbums.push(artist)
    }
  }

  const artistsByGenre = artistsWithUnviewedAlbums.reduce(
    (genres: Record<string, Many<_Artist>>, artist) => {
      if (!genres[artist.genre]) {
        genres[artist.genre] = []
      }

      genres[artist.genre].push(artist)

      return genres
    },
    {}
  )

  res.send(artistsByGenre)
}
