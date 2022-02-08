import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { _Artist, buildAlbum, buildArtist, mArtist } from '../../../mongoose/Artist'
import { _User, mUser } from '../../../mongoose/User'
import { Many, One } from '../../../mongoose/types'
import { GetAll } from '../../../utils/server/spotify-web-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Many<_Artist>>) {
  const session = await getSession({ req })
  const genreToRefresh = req.query.genre
  await dbConnect()

  const user: One<_User> = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    throw new Error('User not found in database. How are you even logged in?')
  }

  const spotifyFollowedArtists = await GetAll.followedArtists(req)
  const spotifyFollowedArtistsIDs = spotifyFollowedArtists.map((artist) => artist.id)

  user.followedArtists = spotifyFollowedArtistsIDs
  await user.save()

  const artists: Many<_Artist> = await mArtist.find({
    id: { $in: spotifyFollowedArtistsIDs },
  })
  const artistIDs = artists.map((artist) => artist.id)

  const artistsNotInDB: Many<_Artist> = spotifyFollowedArtists
    // Filter out all artists that we've already got in the database
    .filter((spotifyArtist) => !artistIDs.includes(spotifyArtist.id))
    .map(buildArtist)

  const genreFilteredArtists = artists
    .concat(artistsNotInDB)
    .filter((artist) => artist.genre === genreToRefresh)

  let genreFilteredArtistsWithAlbums: Many<_Artist> = []

  for (let i = 0; i < genreFilteredArtists.length; i++) {
    const artist = genreFilteredArtists[i]
    const albums = await GetAll.albumsForArtist(req, artist)

    artist.albums = albums.map(buildAlbum)

    genreFilteredArtistsWithAlbums.push(artist)
  }

  // Save all refreshed artists with their albums to the database
  await mArtist.bulkSave(genreFilteredArtistsWithAlbums)

  const artistsWithFreshAlbums: Many<_Artist> = []

  genreFilteredArtistsWithAlbums.forEach((artistWithAlbums) => {
    artistWithAlbums.albums.some((album) => {
      if (!user?.viewedAlbums.includes(album.id)) {
        //todo majerus: check for republished albums here
        artistsWithFreshAlbums.push(artistWithAlbums)
        return true
      }
    })
  })

  res.send(artistsWithFreshAlbums)
}
