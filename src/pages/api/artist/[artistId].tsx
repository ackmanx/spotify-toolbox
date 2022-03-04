import { HydratedDocument } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/db'
import { _Album, buildAlbum, mAlbum } from '../../../mongoose/Album'
import { _Artist, mArtist } from '../../../mongoose/Artist'
import { mUser } from '../../../mongoose/User'
import { Many, One } from '../../../mongoose/types'
import { isViewed } from '../../../utils/array'
import { SpotifyHelper } from '../../../utils/server/spotify-helper'
import { AlbumsByReleaseType } from '../../artist/[artistId]'

type ResBody = AlbumsByReleaseType | { success: boolean; message?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResBody>) {
  const session = await getSession({ req })
  await dbConnect()

  const user = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    res
      .status(401)
      .send({ success: false, message: 'User not found in database. How are you even logged in?' })
    return
  }

  const artistId = Array.isArray(req.query.artistId) ? req.query.artistId[0] : req.query.artistId

  let albumsInDB: Many<_Album> = await mAlbum.find({ artistId })

  if (albumsInDB.length === 0) {
    const sAlbumsForArtist = await SpotifyHelper.albumsForArtist(req, artistId)
    const mAlbums = sAlbumsForArtist.map((album) => buildAlbum(album, artistId))
    const albumIDs = mAlbums.map((album) => album.id)

    const artist: One<_Artist> = await mArtist.findOne({ id: artistId })

    if (!artist) {
      res.status(401).send({
        success: false,
        message: 'Artist not found in database. How did you even get here?',
      })
      return
    }

    artist.albumIDs = albumIDs
    await artist.save()

    await mAlbum.bulkSave(mAlbums)

    albumsInDB = mAlbums
  }

  const albumsByReleaseType = albumsInDB.reduce(
    (albums: AlbumsByReleaseType, album: HydratedDocument<_Album>) => {
      albums[album.type].push({
        ...album.toObject(),
        isViewed: isViewed(user.viewedAlbums, artistId, album.id),
      })
      return albums
    },
    { single: [], album: [] }
  )

  albumsByReleaseType.album.sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1))
  albumsByReleaseType.single.sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1))

  res.send(albumsByReleaseType)
}
