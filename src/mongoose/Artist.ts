import mongoose, { Model, Schema } from 'mongoose'
import ArtistObjectFull = SpotifyApi.ArtistObjectFull
import { guessGenre } from '../utils/server/guess-genre'

export interface _Artist {
  id: string
  name: string
  coverArt?: string
  genre: string
  albums: _Album[]
}

interface _Album {
  id: string
  type: string
  name: string
  releaseDate: string
  coverArt?: string
}

const AlbumSchema = new Schema<_Album>({
  id: String,
  type: String,
  name: String,
  releaseDate: String,
  coverArt: String,
})

const ArtistSchema = new Schema<_Artist>({
  id: String,
  name: String,
  coverArt: String,
  genre: String,
  albums: [AlbumSchema],
})

export const Artist: Model<_Artist> =
  mongoose.models.Artist ?? mongoose.model('Artist', ArtistSchema)

export const buildArtist = (artist: ArtistObjectFull) => {
  const model = new Artist()

  model.id = artist.id
  model.name = artist.name
  model.coverArt = artist.images.find((image) => image.width === image.height)?.url
  model.genre = guessGenre(artist.genres)

  return model
}
