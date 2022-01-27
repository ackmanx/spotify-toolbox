import SpotifyWebApi from 'spotify-web-api-node'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import ArtistObjectFull = SpotifyApi.ArtistObjectFull

interface SpotifyWebApiResponse<T> {
  body: T
  headers: Record<string, string>
  statusCode: number
}

export const getSpotifyWebApi = async (req: NextApiRequest) => {
  const session = await getSession({ req })

  const spotifyWebApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })

  spotifyWebApi.setAccessToken(session?.accessToken as string)

  return spotifyWebApi
}

export const GetAll = {
  followedArtists: async (req: NextApiRequest) => {
    const limit = 50

    const spotifyWebApi = await getSpotifyWebApi(req)
    const spotifyResponse = await spotifyWebApi.getFollowedArtists({ limit })

    const results: ArtistObjectFull[] = []

    let afterCursor = spotifyResponse.body.artists.cursors.after

    results.push(...spotifyResponse.body.artists.items)

    while (afterCursor) {
      const response = await spotifyWebApi.getFollowedArtists({ limit, after: afterCursor })
      afterCursor = response.body.artists.cursors.after
      results.push(...response.body.artists.items)
    }

    return results
  },
}
