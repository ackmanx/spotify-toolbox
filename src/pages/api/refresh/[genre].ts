import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db'
import { _Artist, Artist } from '../../../mongoose/Artist'
import { GetAll } from '../../../utils/server/spotify-web-api'
import { guessGenre } from '../../../utils/server/guess-genre'
import { HydratedDocument } from 'mongoose'
import { getSession } from 'next-auth/react'
import { FindOne } from '../../../mongoose/types'
import { _User, User } from '../../../mongoose/User'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HydratedDocument<_Artist>[]>
) {
  const session = await getSession({ req })
  const genreToRefresh = req.query.genre
  await dbConnect()

  const user: FindOne<_User> = await User.findOne({ userId: session?.userId })

  if (!user) {
    throw new Error('User not found in database. How are you even logged in?')
  }

  const spotifyFollowedArtists = await GetAll.followedArtists(req)
  const spotifyFollowedArtistsIDs = spotifyFollowedArtists.map((artist) => artist.id)

  user.followedArtists = spotifyFollowedArtistsIDs
  user.save()

  const artists: HydratedDocument<_Artist>[] = await Artist.find({
    id: { $in: spotifyFollowedArtistsIDs },
  })
  const artistIDs = artists.map((artist) => artist.id)

  const artistsNotInDB: HydratedDocument<_Artist>[] = spotifyFollowedArtists
    // Filter out all artists that we've already got in the database
    .filter((spotifyArtist) => !artistIDs.includes(spotifyArtist.id))
    .map((artist) => {
      const model = new Artist()

      model.id = artist.id
      model.name = artist.name
      model.coverArt = artist.images.find((image) => image.width === image.height)?.url
      model.genre = guessGenre(artist.genres)

      return model
    })

  const genreFilteredArtists = artists
    .concat(artistsNotInDB)
    .filter((artist) => artist.genre === genreToRefresh)

  let genreFilteredArtistsWithAlbums: HydratedDocument<_Artist>[] = []

  for (let i = 0; i < genreFilteredArtists.length; i++) {
    const artist = genreFilteredArtists[i]
    const albums = await GetAll.albumsForArtist(req, artist.id)

    artist.albums = albums.map((album) => ({
      id: album.id,
      type: album.type,
      name: album.name,
      releaseDate: album.release_date,
      coverArt: album.images.find((image) => image.width === image.height)?.url,
    }))

    genreFilteredArtistsWithAlbums.push(artist)
  }

  // Save all refreshed artists with their albums to the database
  await Artist.bulkSave(genreFilteredArtistsWithAlbums)

  const artistsWithFreshAlbums: HydratedDocument<_Artist>[] = []

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
