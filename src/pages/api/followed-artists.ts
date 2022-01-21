import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/db'
import { _Artist, Artist } from '../../mongoose/Artist'

export default async function handler(req: NextApiRequest, res: NextApiResponse<_Artist[]>) {
  await dbConnect()

  const result: _Artist[] = await Artist.find()

  res.send(result)
}
