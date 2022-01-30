import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/db'
import { _Artist, Artist } from '../../mongoose/Artist'
import { _User, User } from '../../mongoose/User'
import { getSession } from 'next-auth/react'
import { FindOne } from '../../mongoose/types'

export interface InitResponse {
  artists: _Artist[]
  user: _User | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<InitResponse>) {
  const session = await getSession({ req })
  await dbConnect()

  const user: FindOne<_User> = await User.findOne({ userId: session?.userId })
  const artists: _Artist[] = await Artist.find({ id: { $in: user?.followedArtists } })

  res.send({ user, artists })
}
