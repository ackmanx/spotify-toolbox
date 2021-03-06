import { HydratedDocument, Schema } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { AlbumsByReleaseType, _Album, buildAlbum, mAlbum } from '../../../mongoose/Album'
import { _Artist, mArtist, sendArtistNotFoundError } from '../../../mongoose/Artist'
import { mUser, sendAccessTokenExpiredError, sendUserNotFoundError } from '../../../mongoose/User'
import { Many, One } from '../../../mongoose/types'
import { isViewed, removeDuplicates, sortBy } from '../../../utils/array'
import { SpotifyHelper } from '../../../utils/server/spotify-helper'

type ResBody = AlbumsByReleaseType | { success: boolean; message?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResBody>) {
  const session = await getSession({ req })
  await dbConnect()

  const user = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    sendUserNotFoundError(res)
    return
  }

  const artistId = Array.isArray(req.query.artistId) ? req.query.artistId[0] : req.query.artistId

  const artist: One<_Artist> = await mArtist.findOne({ id: artistId })

  if (!artist) {
    sendArtistNotFoundError(res)
    return
  }

  let mAllAlbumsInDB: Many<_Album> = await mAlbum.find({ artistIds: { $in: artistId } })

  if (!artist.isFirstLoadCompleted) {
    if (session?.isExpired) {
      sendAccessTokenExpiredError(res)
      return
    }

    const sAlbumsForArtist = await SpotifyHelper.albumsForArtist(req, artistId)
    artist.albumIDs = sAlbumsForArtist.map((album) => album.id)

    const albumsInDB_IDs = mAllAlbumsInDB.map((album) => album.id)

    const mAlbums = sAlbumsForArtist.map((album) => buildAlbum(album))

    const mAlbumsToSaveInDB = removeDuplicates(mAlbums, albumsInDB_IDs)

    artist.isFirstLoadCompleted = true

    await mAlbum.bulkSave(mAlbumsToSaveInDB)
    await artist.save()

    mAllAlbumsInDB = mAllAlbumsInDB.concat(mAlbumsToSaveInDB)
  }

  const albumsByReleaseType = mAllAlbumsInDB.reduce(
    (albums: AlbumsByReleaseType, album: HydratedDocument<_Album>) => {
      if (!isViewed(user.viewedAlbums, artistId, album.id)) {
        albums[album.type].push({
          ...album.toObject(),
        })
      }
      return albums
    },
    { single: [], album: [] }
  )

  sortBy(albumsByReleaseType.album, 'releaseDate', 'desc')
  sortBy(albumsByReleaseType.single, 'releaseDate', 'desc')

  res.send(albumsByReleaseType)
}
