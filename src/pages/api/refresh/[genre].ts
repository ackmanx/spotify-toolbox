import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { _Album, buildAlbum, mAlbum } from '../../../mongoose/Album'
import { _Artist, buildArtist, mArtist } from '../../../mongoose/Artist'
import { _User, mUser } from '../../../mongoose/User'
import { Many, One } from '../../../mongoose/types'
import { filterNonNull } from '../../../utils/array'
import { GetAll } from '../../../utils/server/spotify-web-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const genreToRefresh = req.query.genre
  await dbConnect()

  const user: One<_User> = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    res
      .status(401)
      .send({ success: false, message: 'User not found in database. How are you even logged in?' })
    return
  }

  if (session?.isExpired) {
    res.status(401).send({
      success: false,
      message: 'Your Spotify access token is expired. Please sign out then back in.',
    })
    return
  }

  const spotifyFollowedArtists = await GetAll.followedArtists(req)
  const spotifyFollowedArtistsIDs = spotifyFollowedArtists.map((artist) => artist.id)

  user.followedArtists = spotifyFollowedArtistsIDs
  await user.save()

  const artistsInDB: Many<_Artist> = await mArtist.find({
    id: { $in: spotifyFollowedArtistsIDs },
  })
  const artistIDs = artistsInDB.map((artist) => artist.id)

  const artistsNotInDB: Many<_Artist> = spotifyFollowedArtists
    // Filter out all artists that we've already got in the database
    .filter((spotifyArtist) => !artistIDs.includes(spotifyArtist.id))
    .map(buildArtist)

  // Save artists not in the DB
  // This includes all followed artists (no albums though), not just the genre we're refreshing
  await mArtist.bulkSave(artistsNotInDB)

  const genreFilteredArtists = artistsInDB
    .concat(artistsNotInDB)
    .filter((artist) => artist.genre === genreToRefresh)

  // For each artist, get all their albums IDs
  for (let i = 0; i < genreFilteredArtists.length; i++) {
    const artist = genreFilteredArtists[i]
    const sAlbumsForArtist = await GetAll.albumsForArtist(req, artist.id)
    artist.albumIDs = sAlbumsForArtist.map((album) => album.id)

    await artist.save()

    const mAlbumsInDB: Many<_Album> = await mAlbum.find({ _id: artist.albumIDs })
    const mAlbumsInDB_IDs: string[] = mAlbumsInDB.map((album) => album.id)

    const mAlbumsToSave: Many<_Album> = sAlbumsForArtist
      .map((album) => {
        if (!mAlbumsInDB_IDs.includes(album.id)) {
          return buildAlbum(album, artist.id)
        }
      })
      .filter(filterNonNull)

    if (mAlbumsToSave.length) {
      await mAlbum.bulkSave(mAlbumsToSave)
    }
  }

  res.send({ success: true })
}
