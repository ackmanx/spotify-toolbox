import mongoose, { Schema } from 'mongoose'

export interface _Artist {
  id: string
  name: string
  coverArt: string
}

const ArtistSchema = new Schema<_Artist>({
  id: String,
  name: String,
  coverArt: String,
})

export const Artist = mongoose.models.Artist ?? mongoose.model('Artist', ArtistSchema)
