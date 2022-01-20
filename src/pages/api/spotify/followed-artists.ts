import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'
import dbConnect from '../../../lib/db'

type Response = {
  id: string
  name: string
  coverArt: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response[]>) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(403)
  }

  const db = await dbConnect()

  const spotifyApi = new SpotifyWebApi()
  spotifyApi.setAccessToken(session.accessToken as string)

  const resApi = await spotifyApi.getFollowedArtists({ limit: 50 })

  const body = resApi.body.artists.items.map((artist) => ({
    id: artist.id,
    name: artist.name,
    coverArt: artist.images[0]?.url,
  }))

  res.send(body)
}
