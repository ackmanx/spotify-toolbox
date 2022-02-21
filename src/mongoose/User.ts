import mongoose, { Model, Schema } from 'mongoose'

export interface _User {
  userId: string
  isNewUser: boolean
  followedArtists: string[]
  viewedAlbums: _ViewedAlbums
}

export type _ViewedAlbums = {
  [ArtistID: string]: {
    id: string
    name: string
    artistId: string
  }[]
}

const UserSchema = new Schema<_User>({
  userId: { type: String, unique: true },
  isNewUser: { type: Boolean, default: false },
  followedArtists: { type: [String], default: [] },
  // This is an object of dynamic keys, which is hard to model in Mongoose so making it free-form
  viewedAlbums: { type: Schema.Types.Mixed, default: {} },
})

export const mUser: Model<_User> = mongoose.models.User ?? mongoose.model('User', UserSchema)
