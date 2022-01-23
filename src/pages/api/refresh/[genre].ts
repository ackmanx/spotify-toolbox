import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db'
import { _Artist, Artist } from '../../../mongoose/Artist'
import { _User, User } from '../../../mongoose/User'
import { getSession } from 'next-auth/react'
import { FindOne } from '../../../mongoose/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = await getSession({ req })
  await dbConnect()

  res.send({ a: req.query.genre ?? 'no genre sent' })
}
