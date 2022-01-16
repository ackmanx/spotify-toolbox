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

  if (session) {
    // Trying out spotify-web-api-node library to manage requests
    // This does not however manage token refresh or paging
    const spotifyApi = new SpotifyWebApi()
    spotifyApi.setAccessToken(session.accessToken as string)
    const responseApi = await spotifyApi.getArtistAlbums('521qvhdobR0GzhvU6TFw76')

    res.send(responseApi.body)
  } else {
    res.send({
      error: 'You must be sign in to view the protected content on this page.',
    })
  }
}
