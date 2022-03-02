import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../../lib/db'
import { _Album, buildAlbum, mAlbum } from '../../../../mongoose/Album'
import { _Artist, buildArtist, mArtist } from '../../../../mongoose/Artist'
import { _User, mUser } from '../../../../mongoose/User'
import { Many, One } from '../../../../mongoose/types'
import { filterNonNull, removeDuplicates } from '../../../../utils/array'
import { SpotifyHelper } from '../../../../utils/server/spotify-helper'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const artistToRefresh = req.query.artistId

  const session = await getSession({ req })
  await dbConnect()

  const user: One<_User> = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    res
      .status(401)
      .send({ success: false, message: 'User not found in database. How are you even logged in?' })
    return
  }

  if (session?.isExpired) {
    return res.status(401).send({
      success: false,
      message: 'Your Spotify access token is expired. Please sign out then back in.',
    })
  }

  const mArtistToUpdate: One<_Artist> = await mArtist.findOne({
    id: artistToRefresh,
  })

  if (!mArtistToUpdate) {
    return res.status(404).send({
      success: false,
      message:
        'The artist you are trying to refresh is not in the DB. Not sure how you are even here.',
    })
  }

  // Make sure there's an entry for this artist in our viewedAlbums
  if (!user.viewedAlbums[mArtistToUpdate.id]) {
    user.viewedAlbums[mArtistToUpdate.id] = []
  }

  console.log(`REFRESH: Refreshing artist: ${mArtistToUpdate.name}`)

  // Get updated albums from Spotify for artist
  const sAlbumsForArtist = await SpotifyHelper.albumsForArtist(req, mArtistToUpdate.id)

  const viewedAlbumsForArtist = user.viewedAlbums[mArtistToUpdate.id]
  const viewedAlbumsIDs = viewedAlbumsForArtist.map((album) => album.id)

  mArtistToUpdate.albumIDs = sAlbumsForArtist.map((album) => album.id)

  await mArtistToUpdate.save()

  // If album is not viewed, make sure it's not a republish of an existing album by that artist
  sAlbumsForArtist.forEach((album) => {
    if (!viewedAlbumsIDs.includes(album.id)) {
      viewedAlbumsForArtist.forEach((viewed) => {
        if (viewed.name === album.name) {
          console.log(`REFRESH: Found duplicate album: ${album.name}`)
          viewedAlbumsForArtist.push({
            id: album.id,
            artistId: mArtistToUpdate.id,
            name: album.name,
          })
        }
      })
    }
  })

  user.markModified('viewedAlbums')
  await user.save()

  // Get all albums from DB using the newly-updated album list we got from Spotify
  // Any albums that aren't in DB yet we will add
  const mAlbumsInDB: Many<_Album> = await mAlbum.find({ _id: mArtistToUpdate.albumIDs })
  const mAlbumsInDB_IDs: string[] = mAlbumsInDB.map((album) => album.id)

  const mAlbumsToSave: Many<_Album> = removeDuplicates(sAlbumsForArtist, mAlbumsInDB_IDs).map(
    (album) => buildAlbum(album, mArtistToUpdate.id)
  )

  if (mAlbumsToSave.length) {
    console.log(`REFRESH: Adding ${mAlbumsToSave.length} albums to DB`)
    await mAlbum.bulkSave(mAlbumsToSave)
  }

  res.send({ success: true })
}
