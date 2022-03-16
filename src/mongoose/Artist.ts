import mongoose, { Model, Schema } from 'mongoose'
import { NextApiResponse } from 'next'

import { guessGenre } from '../utils/server/guess-genre'

import ArtistObjectFull = SpotifyApi.ArtistObjectFull

export interface _Artist {
  //The document's ID will be Spotify's artist ID
  _id: string
  //Spotify artist ID
  id: string
  name: string
  coverArt?: string
  genre: string
  albumIDs: string[]
  //First load will get all the albums for an artist and insert into ablum collection
  isFirstLoadCompleted: boolean
}

const ArtistSchema = new Schema<_Artist>({
  _id: String,
  id: String,
  name: String,
  coverArt: String,
  genre: String,
  albumIDs: [String],
  isFirstLoadCompleted: Boolean,
})

export const mArtist: Model<_Artist> =
  mongoose.models.Artist ?? mongoose.model('Artist', ArtistSchema)

export const buildArtist = (artist: ArtistObjectFull) => {
  const model = new mArtist()

  model._id = artist.id
  model.id = artist.id
  model.name = artist.name
  model.coverArt = artist.images.find((image) => image.width === image.height)?.url
  model.genre = guessGenre(artist.genres)

  return model
}

export const sendArtistNotFoundError = (res: NextApiResponse) => {
  res.status(401).send({
    success: false,
    message: 'Artist not found in database. How is that even possible?',
  })
}
