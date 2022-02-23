import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'

import { _Artist } from '../../mongoose/Artist'

import ArtistObjectFull = SpotifyApi.ArtistObjectFull
import AlbumObjectSimplified = SpotifyApi.AlbumObjectSimplified

interface SpotifyWebApiResponse<T> {
  body: T
  headers: Record<string, string>
  statusCode: number
}

export const getSpotifyWebApi = async (reqOrToken: NextApiRequest | string) => {
  let accessToken: string

  if (typeof reqOrToken !== 'string') {
    const session = await getSession({ req: reqOrToken })
    accessToken = session?.accessToken as string
  } else {
    accessToken = reqOrToken
  }

  const spotifyWebApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  })

  spotifyWebApi.setAccessToken(accessToken)

  return spotifyWebApi
}

export const SpotifyHelper = {
  followedArtists: async (reqOrToken: NextApiRequest | string) => {
    const limit = 50

    const spotifyWebApi = await getSpotifyWebApi(reqOrToken)
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
  albumsForArtist: async (reqOrToken: NextApiRequest | string, artistID: string) => {
    const limit = 50
    const options = {
      include_groups: 'single,album',
      limit,
      country: 'US',
    }

    const spotifyWebApi = await getSpotifyWebApi(reqOrToken)
    const spotifyResponse = await spotifyWebApi.getArtistAlbums(artistID, options)

    const results: AlbumObjectSimplified[] = []

    results.push(...spotifyResponse.body.items)

    const remainingPages = Math.ceil(spotifyResponse.body.total / spotifyResponse.body.limit)

    for (let currentPage = 1; currentPage < remainingPages; currentPage++) {
      const offset = currentPage * limit
      const response = await spotifyWebApi.getArtistAlbums(artistID, { ...options, offset })
      results.push(...response.body.items)
    }

    return results
  },
  tracksForAlbum: async (reqOrToken: NextApiRequest | string, albumId: string) => {
    const spotifyWebApi = await getSpotifyWebApi(reqOrToken)
    const response = await spotifyWebApi.getAlbumTracks(albumId, { limit: 50, offset: 0 })
    return response.body.items.map((track) => track.id)
  },
}
