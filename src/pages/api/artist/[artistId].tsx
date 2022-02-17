import { HydratedDocument } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { _Album, buildAlbum, mAlbum } from '../../../mongoose/Album'
import { mUser } from '../../../mongoose/User'
import { Many } from '../../../mongoose/types'
import { GetAll } from '../../../utils/server/spotify-web-api'
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

  const artistId = Array.isArray(req.query.artistId) ? req.query.artistId[0] : req.query.artistId

  let albumsInDB: Many<_Album> = await mAlbum.find({ artistId })

  if (albumsInDB.length === 0) {
    const sAlbumsForArtist = await GetAll.albumsForArtist(req, artistId)
    const mAlbums = sAlbumsForArtist.map((album) => buildAlbum(album, artistId))

    await mAlbum.bulkSave(mAlbums)

    albumsInDB = mAlbums
  }

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
