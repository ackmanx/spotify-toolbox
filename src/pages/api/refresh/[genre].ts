import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db'
import { _Artist, Artist } from '../../../mongoose/Artist'
import { _User, User } from '../../../mongoose/User'
import { getSession } from 'next-auth/react'
import { FindOne } from '../../../mongoose/types'
import { GetAll, getSpotifyWebApi } from '../../../utils/server/spotify-web-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = await getSession({ req })
  await dbConnect()

  const spotify = await getSpotifyWebApi(req)
  const spotifyResponse = await spotify.getFollowedArtists({ limit: 50 })
  const allFollowedArtists = await GetAll.followedArtists(spotifyResponse, spotify)

  res.send(allFollowedArtists)
}
