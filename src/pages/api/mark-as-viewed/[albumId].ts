import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { _User, mUser } from '../../../mongoose/User'
import { One } from '../../../mongoose/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const albumToMark = Array.isArray(req.query.albumId) ? req.query.albumId[0] : req.query.albumId
  await dbConnect()

  const user: One<_User> = await mUser.findOne({ userId: session?.userId })

  user?.viewedAlbums.push(albumToMark)
  user?.save()

  res.send({ success: true })
}
