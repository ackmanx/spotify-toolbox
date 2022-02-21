import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../../lib/db'
import { _Album, mAlbum } from '../../../../mongoose/Album'
import { _User, mUser } from '../../../../mongoose/User'
import { One } from '../../../../mongoose/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  const albumToMark = Array.isArray(req.query.albumId) ? req.query.albumId[0] : req.query.albumId
  const artistId = Array.isArray(req.query.artistId) ? req.query.artistId[0] : req.query.artistId

  await dbConnect()

  const user: One<_User> = await mUser.findOne({ userId: session?.userId })
  const album: One<_Album> = await mAlbum.findOne({ id: albumToMark })

  if (!user || !album) {
    res.status(401).send({
      success: false,
      message: 'User/Album not found in database. Not sure how this is even possible?',
    })
    return
  }

  if (!user.viewedAlbums[artistId]) {
    user.viewedAlbums[artistId] = []
  }

  user.viewedAlbums[artistId].push({ id: albumToMark, artistId, name: album.name })
  user.markModified('viewedAlbums')
  await user.save()

  res.send({ success: true })
}
