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

const sleep = () => new Promise((resolve) => setTimeout(resolve, 5000))

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
  '64EHlRxOKVjlK1CY4RPjJz',
  '5jsn3eI1p3zPxbOtdR5utg',
  '3hxj3PCyMZ8sw1CLJmwNOL',
  '72EDxwi1dk0kbW17j0RbM8',
  '3RJHv4CKib7TnAJmIIp6cE',
  '4Du0xnYcDmMyFdFK3rtDBf',
  '0ys8pXuROuilOvihIy2Hsq',
  '69CxasDbGDE7jDy3rY0uXU',
]

async function main() {
  const albumsThatExist = []
  const numInPage = 5

  const pages = albumIDs.length / numInPage

  for (let i = 0; pages > i; i++) {
    const albumIDsInPage = albumIDs.slice(numInPage * i, numInPage * i + numInPage)
    console.log(777, 'IDs in page', albumIDsInPage)
    const albums = await spotifyWebApi.getAlbums(albumIDsInPage)

    albums.body.albums.forEach((album) => {
      if (album) {
        console.log(777, 'found', album.id)
        albumsThatExist.push(album.id)
      }
    })
  }

  const albumsNoLongerWithSpotify = removeDuplicates(albumIDs, albumsThatExist)

  console.log(777, '**********')
  console.log(777, 'albums not in spotify', albumsNoLongerWithSpotify)
}

main()

function removeDuplicates(source, overlap) {
  return source.filter((item) => !overlap.includes(item))
}
