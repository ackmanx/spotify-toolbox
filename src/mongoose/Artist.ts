import mongoose, { Model, Schema } from 'mongoose'

import { guessGenre } from '../utils/server/guess-genre'

import ArtistObjectFull = SpotifyApi.ArtistObjectFull
import AlbumObjectSimplified = SpotifyApi.AlbumObjectSimplified

export interface _Artist {
  id: string
  name: string
  coverArt?: string
  genre: string
  albums: _Album[]
}

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

const ArtistSchema = new Schema<_Artist>({
  id: String,
  name: String,
  coverArt: String,
  genre: String,
  albums: [AlbumSchema],
})

export const mArtist: Model<_Artist> =
  mongoose.models.Artist ?? mongoose.model('Artist', ArtistSchema)

export const buildArtist = (artist: ArtistObjectFull) => {
  const model = new mArtist()

  model.id = artist.id
  model.name = artist.name
  model.coverArt = artist.images.find((image) => image.width === image.height)?.url
  model.genre = guessGenre(artist.genres)

  return model
}

export const buildAlbum = (album: AlbumObjectSimplified) => ({
  id: album.id,
  type: album.album_type,
  name: album.name,
  releaseDate: album.release_date,
  coverArt: album.images.find((image) => image.width === image.height)?.url,
  spotifyWebUrl: album.external_urls.spotify,
  spotifyUri: album.uri,
})
