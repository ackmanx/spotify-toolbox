import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'

// This can be the type of the NextApiResponse<Data>
type Data = {
  content?: string
  error?: string
}

/*
 * This is an example of an API call to Spotify that requires authentication
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    res.send({
      error: 'You must be sign in to view the protected content on this page.',
    })
    return
  }

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
