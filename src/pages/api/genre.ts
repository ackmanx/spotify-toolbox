import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../lib/db'
import { _Album, mAlbum } from '../../mongoose/Album'
import { _Artist, mArtist } from '../../mongoose/Artist'
import { _User, mUser } from '../../mongoose/User'
import { Many, One } from '../../mongoose/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  await dbConnect()

  const user: One<_User> = await mUser.findOne({ userId: session?.userId })

  const mFollowedArtistsInDB: Many<_Artist> = await mArtist.find({
    id: { $in: user?.followedArtists },
  })

  const artistsWithUnviewedAlbums = mFollowedArtistsInDB.filter(async (artist) => {
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
