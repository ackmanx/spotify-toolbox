import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { _Album, mAlbum } from '../../../mongoose/Album'
import { _Artist, buildArtist, mArtist } from '../../../mongoose/Artist'
import { _User, mUser } from '../../../mongoose/User'
import { Many, One } from '../../../mongoose/types'
import { GetAll } from '../../../utils/server/spotify-web-api'

type ResBody = Record<string, Many<_Artist>>

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResBody>) {
  const session = await getSession({ req })
  await dbConnect()

  const user = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    throw new Error('User not found in DB')
  }

  let mFollowedArtists: Many<_Artist> = []

  // If this is first sign-in for a user, they won't have any followed artists because we haven't yet pinged Spotify
  if (!user.followedArtists.length) {
    const sFollowedArtists = await GetAll.followedArtists(req)
    user.followedArtists = sFollowedArtists.map((artist) => artist.id)
    await user.save()

    mFollowedArtists = sFollowedArtists.map((artist) => buildArtist(artist))
    await mArtist.bulkSave(mFollowedArtists)
  } else {
    mFollowedArtists = await mArtist.find({
      id: { $in: user?.followedArtists },
    })
  }

  const artistsWithUnviewedAlbums = mFollowedArtists.filter(async (artist) => {
    const albums: Many<_Album> = await mAlbum.find({ id: { $in: artist.albums } })
    return albums.some((album) => !user?.viewedAlbums.includes(album.id))
  })

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
