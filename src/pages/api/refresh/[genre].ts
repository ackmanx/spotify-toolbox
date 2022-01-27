import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db'
import { _Artist, Artist } from '../../../mongoose/Artist'
import { _User, User } from '../../../mongoose/User'
import { getSession } from 'next-auth/react'
import { FindOne } from '../../../mongoose/types'
import { GetAll, getSpotifyWebApi } from '../../../utils/server/spotify-web-api'
import { guessGenre } from '../../../utils/server/guess-genre'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const genreToRefresh = req.query.genre
  await dbConnect()

  const spotifyFollowedArtists = await GetAll.followedArtists(req)
  const spotifyFollowedArtistsIDs = spotifyFollowedArtists.map((artist) => artist.id)

  const artists: _Artist[] = await Artist.find({ artistId: { $in: spotifyFollowedArtistsIDs } })
  const artistIDs = artists.map((artist) => artist.artistId)

  const artistsNotInDB: _Artist[] = spotifyFollowedArtists
    // Filter out all artists that we've already got in the database
    .filter((spotifyArtist) => !artistIDs.includes(spotifyArtist.id))
    .map(
      (artist) =>
        new Artist({
          id: artist.id,
          name: artist.name,
          coverArt: artist.images.find((image) => image.width === image.height),
          genre: guessGenre(artist.genres),
        })
    )

  const genreFilteredArtists = artists
    .concat(artistsNotInDB)
    .filter((artist) => artist.genre === genreToRefresh)

  //todo majerus: then we need to get all albums for each artist
  //todo majerus: save all artists into db
  //todo majerus: filter out seen ones
  //todo majerus: if there are new ones, run them through the same-name filter
  //todo majerus: I can't do this until I update viewed albums list to include album name because expired albums that are republished are removed from spotify i think
  //todo majerus: finally, the remaining are what's new, return the artists that have new albums

  res.send(genreFilteredArtists)
}
