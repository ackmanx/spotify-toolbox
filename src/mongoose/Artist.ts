import mongoose, { Model, Schema } from 'mongoose'

import { guessGenre } from '../utils/server/guess-genre'

import ArtistObjectFull = SpotifyApi.ArtistObjectFull

export interface _Artist {
  id: string
  name: string
  coverArt?: string
  genre: string
  albums: string[]
}

const ArtistSchema = new Schema<_Artist>({
  id: String,
  name: String,
  coverArt: String,
  genre: String,
  albums: [String],
})

export const mArtist: Model<_Artist> =
  mongoose.models.Artist ?? mongoose.model('Artist', ArtistSchema)

export const buildArtist = (artist: ArtistObjectFull) => {
  const model = new mArtist()

  model.id = artist.id
  model.name = artist.name
  model.coverArt = artist.images.find((image) => image.width === image.height)?.url
  model.genre = guessGenre(artist.genres)

  return model
}
