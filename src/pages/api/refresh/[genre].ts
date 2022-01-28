import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db'
import { _Artist, Artist } from '../../../mongoose/Artist'
import { GetAll } from '../../../utils/server/spotify-web-api'
import { guessGenre } from '../../../utils/server/guess-genre'
import { HydratedDocument } from 'mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const genreToRefresh = req.query.genre
  await dbConnect()

  const spotifyFollowedArtists = await GetAll.followedArtists(req)
  const spotifyFollowedArtistsIDs = spotifyFollowedArtists.map((artist) => artist.id)

  const artists: HydratedDocument<_Artist>[] = await Artist.find({
    artistId: { $in: spotifyFollowedArtistsIDs },
  })
  const artistIDs = artists.map((artist) => artist.artistId)

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

  let artistResponse: HydratedDocument<_Artist>[] = []

  for (let i = 0; i < genreFilteredArtists.length; i++) {
    const artist = genreFilteredArtists[i]
    const albums = await GetAll.albumsForArtist(req, artist.artistId)

    artist.albums = albums.map((album) => ({
      id: album.id,
      type: album.type,
      name: album.name,
      releaseDate: album.release_date,
      coverArt: album.images.find((image) => image.width === image.height)?.url,
    }))

    artistResponse.push(artist)
  }

  // Save all newly populated artists with their albums to the database
  await Artist.bulkSave(artistResponse)

  //todo majerus: filter out seen ones
  //todo majerus: if there are new ones, run them through the same-name filter
  //todo majerus: I can't do this until I update viewed albums list to include album name because expired albums that are republished are removed from spotify i think
  //todo majerus: finally, the remaining are what's new, return the artists that have new albums

  res.send(artistResponse)
}
