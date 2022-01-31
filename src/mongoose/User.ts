import mongoose, { Model, Schema } from 'mongoose'

export interface _User {
  userId: string
  accessTokenExpires: number
  followedArtists: string[]
  viewedAlbums: string[]
}

const UserSchema = new Schema<_User>({
  userId: String,
  accessTokenExpires: Number,
  followedArtists: [String],
  viewedAlbums: [String],
})

export const mUser: Model<_User> = mongoose.models.User ?? mongoose.model('User', UserSchema)
