import mongoose, { Model, Schema } from 'mongoose'

export interface _Artist {
  _id: string
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
  _id: String,
  id: String,
  name: String,
  coverArt: String,
  genre: String,
  albums: [AlbumSchema],
})

export const Artist: Model<_Artist> =
  mongoose.models.Artist ?? mongoose.model('Artist', ArtistSchema)
