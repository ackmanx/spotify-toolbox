import mongoose, { Model, Schema } from 'mongoose'

export interface _User {
  userId: string
  isNewUser: boolean
  followedArtists: string[]
  viewedAlbums: _ViewedAlbum[]
}

export interface _ViewedAlbum {
  id: string
  name: string
}

const UserSchema = new Schema<_User>({
  userId: { type: String, unique: true },
  isNewUser: Boolean,
  followedArtists: [String],
  viewedAlbums: [
    {
      id: String,
      name: String,
    },
  ],
})

export const mUser: Model<_User> = mongoose.models.User ?? mongoose.model('User', UserSchema)
