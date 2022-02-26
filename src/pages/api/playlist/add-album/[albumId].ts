import { NextApiRequest, NextApiResponse } from 'next'

import dbConnect from '../../../../lib/db'
import { SpotifyHelper } from '../../../../utils/server/spotify-helper'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const albumToAdd = Array.isArray(req.query.albumId) ? req.query.albumId[0] : req.query.albumId

  await dbConnect()

  const tracksForAlbum = await SpotifyHelper.tracksForAlbum(req, albumToAdd)

  const response = await SpotifyHelper.addTracksToPlaylist(
    req,
    'I Already Saw That',
    tracksForAlbum
  )

  if (response.error) {
    return res.status(404).send({ success: false, message: response.error })
  }

  res.send({ success: response.status })
}
