import { HydratedDocument } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { _Album, mAlbum } from '../../../mongoose/Album'
import { mUser } from '../../../mongoose/User'
import { Many } from '../../../mongoose/types'
import { AlbumsByReleaseType } from '../../artist/[artistId]'

type ResBody = AlbumsByReleaseType | { success: boolean; message?: string }

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

  const artistId = req.query.artistId

  const albumsInDB: Many<_Album> = await mAlbum.find({ artistId })

  const albumsByReleaseType = albumsInDB.reduce(
    (albums: AlbumsByReleaseType, album: HydratedDocument<_Album>) => {
      const isViewed = user.viewedAlbums.includes(album.id)
      albums[album.type].push({ ...album.toObject(), isViewed })
      return albums
    },
    { single: [], album: [] }
  )

  res.send(albumsByReleaseType)
}
