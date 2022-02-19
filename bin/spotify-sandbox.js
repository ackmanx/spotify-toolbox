#!/usr/bin/env bash
":" //# comment; exec /usr/bin/env node --input-type=module - "$@" < "$0"

/*
 * Playground to hit Spotify endpoints
 * Get an access token here:
 *  https://developer.spotify.com/console/get-current-user/
 *
 * Note the bash trick above is what lets me use ES6 imports in this script
 * https://stackoverflow.com/questions/48179714/how-can-an-es6-module-be-run-as-a-script-in-node
 */
import SpotifyWebApi from 'spotify-web-api-node'

const accessToken =
  ''
const clientId = ''
const clientSecret = ''

const spotifyWebApi = new SpotifyWebApi({
  clientId,
  clientSecret,
})

spotifyWebApi.setAccessToken(accessToken)

const albumIDs = [
  "64EHlRxOKVjlK1CY4RPjJz",
]

const albums = await spotifyWebApi.getAlbums(albumIDs)

console.log(777, albums.body)
