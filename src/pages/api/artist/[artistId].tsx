import { HydratedDocument } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { AlbumsByReleaseType, _Album, buildAlbum, mAlbum } from '../../../mongoose/Album'
import { _Artist, mArtist, sendArtistNotFoundError } from '../../../mongoose/Artist'
import { mUser, sendAccessTokenExpiredError, sendUserNotFoundError } from '../../../mongoose/User'
import { Many, One } from '../../../mongoose/types'
import { isViewed, sortBy } from '../../../utils/array'
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

  let albumsInDB: Many<_Album> = await mAlbum.find({ artistIds: { $in: artistId } })

  if (albumsInDB.length === 0) {
    if (session?.isExpired) {
      sendAccessTokenExpiredError(res)
      return
    }

    const sAlbumsForArtist = await SpotifyHelper.albumsForArtist(req, artistId)
    const mAlbums = sAlbumsForArtist.map((album) => buildAlbum(album))
    const albumIDs = mAlbums.map((album) => album.id)

    const artist: One<_Artist> = await mArtist.findOne({ id: artistId })

    if (!artist) {
      sendArtistNotFoundError(res)
      return
    }

    artist.albumIDs = albumIDs
    await artist.save()

    await mAlbum.bulkSave(mAlbums)

    albumsInDB = mAlbums
  }

  const albumsByReleaseType = albumsInDB.reduce(
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
