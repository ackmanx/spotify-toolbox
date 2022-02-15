import mongoose, { HydratedDocument, Model, Schema } from 'mongoose'

import AlbumObjectSimplified = SpotifyApi.AlbumObjectSimplified

export interface _Album {
  id: string
  artistId: string
  type: string
  name: string
  releaseDate: string
  coverArt?: string
  spotifyUri: string
  spotifyWebUrl: string
}

const AlbumSchema = new Schema<_Album>({
  id: String,
  artistId: String,
  type: String,
  name: String,
  releaseDate: String,
  coverArt: String,
  spotifyUri: String,
  spotifyWebUrl: String,
})

export const mAlbum: Model<_Album> = mongoose.models.Album ?? mongoose.model('Album', AlbumSchema)

export const buildAlbum = (
  album: AlbumObjectSimplified,
  artistId: string
): HydratedDocument<_Album> => {
  const newAlbum = new mAlbum()

  newAlbum.id = album.id
  newAlbum.artistId = artistId
  newAlbum.type = album.album_type
  newAlbum.name = album.name
  newAlbum.releaseDate = album.release_date
  newAlbum.coverArt = album.images.find((image) => image.width === image.height)?.url
  newAlbum.spotifyWebUrl = album.external_urls.spotify
  newAlbum.spotifyUri = album.uri

  return newAlbum
}
