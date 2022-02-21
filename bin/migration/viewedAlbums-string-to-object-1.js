#!/usr/bin/env bash
":" //# comment; exec /usr/bin/env node --input-type=module - "$@" < "$0"

/*
 * Get an access token here:
 *  https://developer.spotify.com/console/get-current-user/
 *
 * Note the bash trick above is what lets me use ES6 imports in this script
 * https://stackoverflow.com/questions/48179714/how-can-an-es6-module-be-run-as-a-script-in-node
 */
import * as fs from 'fs'
import SpotifyWebApi from 'spotify-web-api-node'

const albumIDs = []

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const accessToken = ''
const clientId = ''
const clientSecret = ''

const spotifyWebApi = new SpotifyWebApi({
  clientId,
  clientSecret,
})

spotifyWebApi.setAccessToken(accessToken)

async function main() {
  const albumsThatExist = []
  const numInPage = 20

  const pages = Math.ceil(albumIDs.length / numInPage)

  for (let i = 0; pages > i; i++) {
    console.log(777, `Fetching page ${i + 1} of ${pages}`)

    const albumIDsInPage = albumIDs.slice(numInPage * i, numInPage * i + numInPage)
    const response = await spotifyWebApi.getAlbums(albumIDsInPage)
    const albums = response.body.albums

    const viewedAlbums = albums
      .map((album) => {
        if (album) {
          albumsThatExist.push(album.id)

          return {
            id: album.id,
            name: album.name,
          }
        }
      })
      .filter(Boolean)

    fs.appendFile(
      'migration-album-ids-result.jsonl',
      `${JSON.stringify(viewedAlbums)}\n`,
      (err) => {
        if (err) {
          console.error(err)
        }
      }
    )

    await sleep(1000)
  }

  const albumsNoLongerWithSpotify = removeDuplicates(albumIDs, albumsThatExist)
}

main()

function removeDuplicates(source, overlap) {
  return source.filter((item) => !overlap.includes(item))
}
