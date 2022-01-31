import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Header from '../../components/header/Header'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { _Album, _Artist } from '../../mongoose/Artist'

type AlbumsByReleaseType = Record<string, _Album[]>

const Main = styled.main`
  text-align: center;
`

const ArtistPage: NextPage = () => {
  const router = useRouter()
  const { artistId } = router.query
  const { data, status } = useSession()
  const [artist, setArtist] = useState<_Artist>()
  const [albums, setAlbums] = useState<AlbumsByReleaseType>()

  useEffect(() => {
    async function doStuff() {
      const response: Response = await fetch(`/api/artist/${artistId}`)
      const bodyArtist: _Artist = await response.json()

      setArtist(bodyArtist)
      setAlbums(
        bodyArtist.albums.reduce(
          (acc: AlbumsByReleaseType, curr: _Album) => {
            acc[curr.type].push(curr)
            return acc
          },
          { single: [], album: [] }
        )
      )
    }

    if (data) {
      doStuff()
    }
  }, [artistId, data])

  if (!albums || !artist) return null

  return (
    <>
      <Head>
        <title>Toolbox - {artist.name}</title>
      </Head>
      <Header />
      <Main>
        <h1>{artist.name}</h1>
        <h2>Albums</h2>
        {albums.album.map((album) => (
          <h3 key={album.id}>{album.name}</h3>
        ))}

        <h2>Singles</h2>
        {albums.single.map((album) => (
          <h3 key={album.id}>{album.name}</h3>
        ))}
      </Main>
    </>
  )
}

export default ArtistPage
