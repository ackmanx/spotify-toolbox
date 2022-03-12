import { NextApiRequest, NextApiResponse } from 'next'

import dbConnect from '../../../../lib/db'
import { sendAccessTokenExpiredError } from '../../../../mongoose/User'
import { sendGenericError } from '../../../../utils/server/error-responses'
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
      sendAccessTokenExpiredError(res)
      return
    }

    return sendGenericError(res, error.body.error.message)
  }

  res.send({ success: addTracksToPlaylistResult.status })
}
