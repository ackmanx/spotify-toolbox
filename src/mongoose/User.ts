import mongoose, { HydratedDocument, Model, Schema } from 'mongoose'

export interface _User {
  userId: string
  followedArtists: string[]
  viewedAlbums: string[]
}

const UserSchema = new Schema<_User>({
  userId: String,
  followedArtists: [String],
  viewedAlbums: [String],
})

export const User: Model<_User> = mongoose.models.User ?? mongoose.model('User', UserSchema)
