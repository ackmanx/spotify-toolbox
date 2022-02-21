import mongoose, { Model, Schema } from 'mongoose'

export interface _User {
  userId: string
  isNewUser: boolean
  followedArtists: string[]
  viewedAlbums: _ViewedAlbums
}

type _ViewedAlbums = {
  [ArtistID: string]: {
    id: string
    name: string
    artistId: string
  }[]
}

const UserSchema = new Schema<_User>({
  userId: { type: String, unique: true },
  isNewUser: Boolean,
  followedArtists: [String],
  // This is an object of dynamic keys, which is hard to model in Mongoose so making it free-form
  viewedAlbums: Schema.Types.Mixed,
})

export const mUser: Model<_User> = mongoose.models.User ?? mongoose.model('User', UserSchema)
