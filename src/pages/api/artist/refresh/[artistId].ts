import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../../lib/db'
import { _Album, buildAlbum, mAlbum } from '../../../../mongoose/Album'
import { _Artist, buildArtist, mArtist, sendArtistNotFoundError } from '../../../../mongoose/Artist'
import {
  _User,
  mUser,
  sendAccessTokenExpiredError,
  sendUserNotFoundError,
} from '../../../../mongoose/User'
import { Many, One } from '../../../../mongoose/types'
import { filterNonNull, removeDuplicates } from '../../../../utils/array'
import { SpotifyHelper } from '../../../../utils/server/spotify-helper'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const artistToRefresh = req.query.artistId

  const session = await getSession({ req })
  await dbConnect()

  const user: One<_User> = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    sendUserNotFoundError(res)
    return
  }

  if (session?.isExpired) {
    sendAccessTokenExpiredError(res)
    return
  }

  const mArtistToUpdate: One<_Artist> = await mArtist.findOne({
    id: artistToRefresh,
  })

  if (!mArtistToUpdate) {
    sendArtistNotFoundError(res)
    return
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
    (album) => buildAlbum(album)
  )

  if (mAlbumsToSave.length) {
    console.log(`REFRESH: Adding ${mAlbumsToSave.length} albums to DB`)
    await mAlbum.bulkSave(mAlbumsToSave)
  }

  res.send({ success: true })
}
