import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../../lib/db'
import { _Album, mAlbum } from '../../../../mongoose/Album'
import { _User, mUser } from '../../../../mongoose/User'
import { One } from '../../../../mongoose/types'
import { SpotifyHelper } from '../../../../utils/server/spotify-helper'
import artistId from '../../../artist/[artistId]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  const albumToAdd = Array.isArray(req.query.albumId) ? req.query.albumId[0] : req.query.albumId

  await dbConnect()

  const tracksForAlbum = await SpotifyHelper.tracksForAlbum(req, albumToAdd)

  const response = await SpotifyHelper.addTracksToPlaylist(req, tracksForAlbum)

  res.send({ success: response })
}
