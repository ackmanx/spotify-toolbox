import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db'
import { _Artist, mArtist } from '../../../mongoose/Artist'
import { FindOne } from '../../../mongoose/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse<_Artist | null>) {
  const artistId = req.query.artistId
  await dbConnect()

  const artist: FindOne<_Artist> = await mArtist.findOne({ id: artistId })

  res.send(artist)
}
