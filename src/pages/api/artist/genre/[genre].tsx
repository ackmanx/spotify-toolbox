import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import dbConnect from '../../../../lib/db'
import { _Artist, mArtist } from '../../../../mongoose/Artist'
import { mUser, sendUserNotFoundError } from '../../../../mongoose/User'
import { Many } from '../../../../mongoose/types'
import { isViewed, sortBy } from '../../../../utils/array'

type ResBody = Many<_Artist> | { success: boolean; message?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResBody>) {
  const session = await getSession({ req })
  await dbConnect()

  const genre = Array.isArray(req.query.genre) ? req.query.genre[0] : req.query.genre

  const user = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    sendUserNotFoundError(res)
    return
  }

  let mFollowedArtistsInDB: Many<_Artist> = await mArtist.find({
    id: { $in: user.followedArtists },
    genre,
  })

  const artistsWithUnviewedAlbums = mFollowedArtistsInDB.filter(
    (artist) =>
      artist.albumIDs.length === 0 ||
      artist.albumIDs.some((albumId) => !isViewed(user.viewedAlbums, artist.id, albumId))
  )

  sortBy(artistsWithUnviewedAlbums, 'name')

  res.send(artistsWithUnviewedAlbums)
}
