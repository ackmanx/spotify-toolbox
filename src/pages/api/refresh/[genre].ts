import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db'
import { _Artist, Artist } from '../../../mongoose/Artist'
import { _User, User } from '../../../mongoose/User'
import { getSession } from 'next-auth/react'
import { FindOne } from '../../../mongoose/types'
import { GetAll, getSpotifyWebApi } from '../../../utils/server/spotify-web-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const genreToRefresh = req.query.genreToRefresh
  await dbConnect()

  const spotifyFollowedArtists = await GetAll.followedArtists(req)
  const spotifyFollowedArtistsIDs = spotifyFollowedArtists.map((artist) => artist.id)

  const artists: _Artist[] = await Artist.find({ artistId: { $in: spotifyFollowedArtistsIDs } })
  const artistIDs = artists.map((artist) => artist.artistId)

  const artistsNotInDB = spotifyFollowedArtistsIDs.filter(
    (spotifyArtist) => !artistIDs.includes(spotifyArtist)
  )

  //todo majerus: not in db means we haven't guessed the genre yet
  //todo majerus: need to guess, add it to list of artists we already got from db and then save it to the db

  //todo majerus: now we can filter all artists based on genre, and send those back to prove it's correct

  //todo majerus: then we need to get all albums for each artist and filter out seen ones
  //todo majerus: if there are new ones, run them through the same-name filter
  //todo majerus: finally, the remaining are what's new
  //todo majerus: only return the artists that have new albums

  //todo majerus: these steps dont' account for saving album data to artist db

  res.send(artistsNotInDB)
}
