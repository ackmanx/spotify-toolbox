import mongoose, { Model, Schema } from 'mongoose'

import AlbumObjectSimplified = SpotifyApi.AlbumObjectSimplified

export interface _Album {
  id: string
  type: string
  name: string
  releaseDate: string
  coverArt?: string
  spotifyUri: string
  spotifyWebUrl: string
}

const AlbumSchema = new Schema<_Album>({
  id: String,
  type: String,
  name: String,
  releaseDate: String,
  coverArt: String,
  spotifyUri: String,
  spotifyWebUrl: String,
})

export const mAlbum: Model<_Album> = mongoose.models.Album ?? mongoose.model('Album', AlbumSchema)

export const buildAlbum = (album: AlbumObjectSimplified) => ({
  id: album.id,
  type: album.album_type,
  name: album.name,
  releaseDate: album.release_date,
  coverArt: album.images.find((image) => image.width === image.height)?.url,
  spotifyWebUrl: album.external_urls.spotify,
  spotifyUri: album.uri,
})
