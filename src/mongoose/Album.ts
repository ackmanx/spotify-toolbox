import mongoose, { HydratedDocument, Model, Schema } from 'mongoose'

import AlbumObjectSimplified = SpotifyApi.AlbumObjectSimplified

export interface _Album {
  _id: string
  id: string
  artistId: string
  type: 'album' | 'single'
  name: string
  releaseDate: string
  coverArt?: string
  spotifyUri: string
  spotifyWebUrl: string
}

const AlbumSchema = new Schema<_Album>({
  _id: String,
  id: { type: String },
  artistId: String,
  type: String,
  name: String,
  releaseDate: String,
  coverArt: String,
  spotifyUri: String,
  spotifyWebUrl: String,
})

export const mAlbum: Model<_Album> = mongoose.models.Album ?? mongoose.model('Album', AlbumSchema)

export type AlbumsByReleaseType = Record<'album' | 'single', _Album[]>

export const buildAlbum = (
  album: AlbumObjectSimplified,
  artistId: string
): HydratedDocument<_Album> => {
  const newAlbum = new mAlbum()

  newAlbum._id = album.id
  newAlbum.id = album.id
  newAlbum.artistId = artistId
  newAlbum.type = album.album_type as _Album['type'] //because I'm only querying Spotify for single/album
  newAlbum.name = album.name
  newAlbum.releaseDate = album.release_date
  newAlbum.coverArt = album.images.find((image) => image.width === image.height)?.url
  newAlbum.spotifyWebUrl = album.external_urls.spotify
  newAlbum.spotifyUri = album.uri

  return newAlbum
}
