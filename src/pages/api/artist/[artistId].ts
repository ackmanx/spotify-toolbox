import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db'
import { _Artist, Artist } from '../../../mongoose/Artist'
import { FindOne } from '../../../mongoose/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse<_Artist | null>) {
  const artistId = req.query.artistId
  await dbConnect()

  const artist: FindOne<_Artist> = await Artist.findOne({ id: artistId })

  res.send(artist)
}
