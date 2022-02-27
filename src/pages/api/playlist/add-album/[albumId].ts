import { NextApiRequest, NextApiResponse } from 'next'

import dbConnect from '../../../../lib/db'
import { SpotifyHelper } from '../../../../utils/server/spotify-helper'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const albumToAdd = Array.isArray(req.query.albumId) ? req.query.albumId[0] : req.query.albumId

  await dbConnect()

  let addTracksToPlaylistResult

  try {
    const tracksForAlbum = await SpotifyHelper.tracksForAlbum(req, albumToAdd)

    const name = 'I Already Saw That'

    addTracksToPlaylistResult = await SpotifyHelper.addTracksToPlaylist(req, name, tracksForAlbum)
  } catch (error: any) {
    if (error.statusCode === 401) {
      return res.status(401).send({
        success: false,
        message: 'Your Spotify access token is expired. Please sign out then back in.',
      })
    }

    return res.status(500).send({ success: false, message: error.body.error.message })
  }

  res.send({ success: addTracksToPlaylistResult.status })
}
