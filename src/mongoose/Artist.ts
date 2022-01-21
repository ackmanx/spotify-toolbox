import mongoose, { Schema } from 'mongoose'

export interface _Artist {
  artistId: string
  name: string
  coverArt: string
}

const ArtistSchema = new Schema<_Artist>({
  artistId: String,
  name: String,
  coverArt: String,
})

export const Artist = mongoose.models.Artist ?? mongoose.model('Artist', ArtistSchema)
