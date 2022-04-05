import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { _Artist, buildArtist, mArtist } from '../../../mongoose/Artist'
import { mUser, sendUserNotFoundError } from '../../../mongoose/User'
import { Many } from '../../../mongoose/types'
import { isViewed, removeDuplicates } from '../../../utils/array'
import { SpotifyHelper } from '../../../utils/server/spotify-helper'

// Genre name key, array of cover art URLs value
type GenresWithCoverArt = Record<string, string[]>

type ResBody = GenresWithCoverArt | { success: boolean; message?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResBody>) {
  const session = await getSession({ req })
  await dbConnect()

  const user = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    sendUserNotFoundError(res)
    return
  }

  let mFollowedArtistsInDB: Many<_Artist>

  if (user.isNewUser) {
    const sFollowedArtists = await SpotifyHelper.followedArtists(req)

    user.followedArtists = sFollowedArtists.map((artist) => artist.id)
    user.isNewUser = false

    await user.save()

    mFollowedArtistsInDB = await mArtist.find({
      id: { $in: user.followedArtists },
    })

    const followedArtistsInDB_IDs = mFollowedArtistsInDB.map((artist) => artist.id)

    const mNewArtistsToSaveToDB: Many<_Artist> = removeDuplicates(
      sFollowedArtists,
      followedArtistsInDB_IDs
    ).map((artist) => buildArtist(artist))

    await mArtist.bulkSave(mNewArtistsToSaveToDB)

    mFollowedArtistsInDB = mFollowedArtistsInDB.concat(mNewArtistsToSaveToDB)
  } else {
    mFollowedArtistsInDB = await mArtist.find({
      id: { $in: user.followedArtists },
    })
  }

  // Genre name key, array of cover art URLs value
  // This is a collection of every artist we follow within a genre because otherwise if user has viewed everything, there'd be no cover art to display for a genre
  const genreCoverArt: Record<string, string[]> = {}

  // This only includes genres with artists that have unviewed albums
  // There's no cover art added though, because we pick those randomly those of all followed artists within a genre
  const genres = mFollowedArtistsInDB.reduce((genres: GenresWithCoverArt, artist) => {
    const hasUnviewedAlbums =
      artist.albumIDs.length === 0 ||
      artist.albumIDs.some((albumId) => !isViewed(user.viewedAlbums, artist.id, albumId))

    if (hasUnviewedAlbums && !genres[artist.genre]) {
      genres[artist.genre] = []
    }

    if (!genreCoverArt[artist.genre]) {
      genreCoverArt[artist.genre] = []
    }

    if (artist.coverArt) {
      genreCoverArt[artist.genre].push(artist.coverArt)
    }

    return genres
  }, {})

  // Go through each genre and randomly get 4 artist cover arts to represent that genre
  // Add them to the `genres` we're iterating on
  Object.entries(genres).forEach(([genre]) => {
    const currentGenre = genres[genre]
    const coverArtsForGenre = genreCoverArt[genre]

    for (let i = 0; i < 4; i++) {
      const imageIndex = Math.floor(Math.random() * coverArtsForGenre.length)
      let potentialCoverArt = coverArtsForGenre[imageIndex]

      if (currentGenre.includes(potentialCoverArt)) {
        const imageIndex = Math.floor(Math.random() * coverArtsForGenre.length)
        potentialCoverArt = coverArtsForGenre[imageIndex]
      }

      currentGenre.push(potentialCoverArt)
    }
  })

  res.send(genres)
}
