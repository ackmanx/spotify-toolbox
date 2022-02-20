import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { _Album, mAlbum } from '../../../mongoose/Album'
import { _User, mUser } from '../../../mongoose/User'
import { One } from '../../../mongoose/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const albumToMark = Array.isArray(req.query.albumId) ? req.query.albumId[0] : req.query.albumId
  await dbConnect()

  const user: One<_User> = await mUser.findOne({ userId: session?.userId })
  const album: One<_Album> = await mAlbum.findOne({ id: albumToMark })

  if (!album) {
    return res.send({
      success: false,
      message:
        'This album must have been magically deleted from the time you marked it as viewed and the microseconds until now',
    })
  }

  user?.viewedAlbums.push({ id: album.id, name: album.name })
  user?.save()

  res.send({ success: true })
}
