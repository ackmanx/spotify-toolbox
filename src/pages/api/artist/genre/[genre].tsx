import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../../lib/db'
import { _Artist, mArtist } from '../../../../mongoose/Artist'
import { mUser } from '../../../../mongoose/User'
import { Many } from '../../../../mongoose/types'

type ResBody = Many<_Artist> | { success: boolean; message?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResBody>) {
  const session = await getSession({ req })
  await dbConnect()

  const genre = Array.isArray(req.query.genre) ? req.query.genre[0] : req.query.genre

  const user = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    res
      .status(401)
      .send({ success: false, message: 'User not found in database. How are you even logged in?' })
    return
  }

  let mFollowedArtistsInDB: Many<_Artist> = await mArtist.find({
    id: { $in: user.followedArtists },
    genre,
  })

  res.send(mFollowedArtistsInDB)
}
