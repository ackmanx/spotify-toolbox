import mongoose, { Model, Schema } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI ?? ''

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached = global.mongoose

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {}

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose)
  }

  cached.conn = await cached.promise

  //todo majerus: this doesn't go here but it works yay
  const ArtistSchema = new Schema({
    id: String,
    name: String,
    coverArt: String,
  })

  const Artist: Model<{ id: string }> = mongoose.model('Artist', ArtistSchema)

  const artist = new Artist({name: 'Eric'})

  await artist.save()

  return cached.conn
}

export default dbConnect
