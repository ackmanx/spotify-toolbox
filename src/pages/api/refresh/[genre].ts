import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db'
import { _Artist, Artist } from '../../../mongoose/Artist'
import { _User, User } from '../../../mongoose/User'
import { getSession } from 'next-auth/react'
import { FindOne } from '../../../mongoose/types'
import { GetAll, getSpotifyWebApi } from '../../../utils/server/spotify-web-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  await dbConnect()

  const allFollowedArtists = await GetAll.followedArtists(req)

  res.send(allFollowedArtists)
}
