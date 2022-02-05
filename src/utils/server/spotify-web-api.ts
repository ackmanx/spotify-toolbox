import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'

import ArtistObjectFull = SpotifyApi.ArtistObjectFull
import AlbumObjectSimplified = SpotifyApi.AlbumObjectSimplified

interface SpotifyWebApiResponse<T> {
  body: T
  headers: Record<string, string>
  statusCode: number
}

export const getSpotifyWebApi = async (reqOrAccessToken: NextApiRequest | string) => {
  let accessToken: string

  if (typeof reqOrAccessToken !== 'string') {
    const session = await getSession({ req: reqOrAccessToken })
    accessToken = session?.accessToken as string
  } else {
    accessToken = reqOrAccessToken
  }

  const spotifyWebApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })

  spotifyWebApi.setAccessToken(accessToken)

  return spotifyWebApi
}

export const GetAll = {
  followedArtists: async (reqOrAccessToken: NextApiRequest | string) => {
    const limit = 50

    const spotifyWebApi = await getSpotifyWebApi(reqOrAccessToken)
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
  albumsForArtist: async (req: NextApiRequest, id: string) => {
    console.log(777, 'Getting albums for:', id) /* delete */
    const limit = 50

    const spotifyWebApi = await getSpotifyWebApi(req)
    const spotifyResponse = await spotifyWebApi.getArtistAlbums(id, {
      include_groups: 'single,album',
      limit,
      country: 'US',
    })

    const results: AlbumObjectSimplified[] = []

    results.push(...spotifyResponse.body.items)

    const numPages = Math.floor(spotifyResponse.body.total / spotifyResponse.body.limit)

    for (let currentPage = 0; currentPage < numPages; currentPage++) {
      const offset = currentPage * limit
      const response = await spotifyWebApi.getArtistAlbums(id, { limit, offset })
      results.push(...response.body.items)
    }

    return results
  },
}
