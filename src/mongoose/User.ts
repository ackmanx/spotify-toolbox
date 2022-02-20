import mongoose, { Model, Schema } from 'mongoose'

export interface _User {
  userId: string
  isNewUser: boolean
  followedArtists: string[]
  viewedAlbums: string[]
}

const UserSchema = new Schema<_User>({
  userId: { type: String, unique: true },
  isNewUser: Boolean,
  followedArtists: [String],
  viewedAlbums: [String],
})

export const mUser: Model<_User> = mongoose.models.User ?? mongoose.model('User', UserSchema)
