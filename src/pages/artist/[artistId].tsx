import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Header from '../../components/header/Header'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { _Album, _Artist } from '../../mongoose/Artist'
import NextImage from 'next/image'
import AlbumPlaceholder from '../../components/album/album-placeholder.png'

type AlbumsByReleaseType = Record<string, _Album[]>

const Main = styled.main`
  text-align: center;
`

const DivAlbumType = styled.div`
  text-align: left;
  padding: 0 20px;
`

const H2 = styled.h2`
  margin: 0;
  color: #ebebeb;
  font-size: 72px;
`

const DivRoot = styled.div`
  display: inline-block;
  width: 300px;
  margin: 10px 20px;
  overflow: hidden;
`

const H3 = styled.h3`
  margin: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
        <DivAlbumType>
          <H2>albums</H2>
        </DivAlbumType>
        {albums.album.map((album) => (
          <DivRoot key={album.id}>
            <NextImage src={album.coverArt || AlbumPlaceholder} width={300} height={300} />
            <H3>{album.name}</H3>
            <p>{album.releaseDate}</p>
          </DivRoot>
        ))}

        <DivAlbumType>
          <H2>singles</H2>
        </DivAlbumType>
        {albums.single.map((album) => (
          <DivRoot key={album.id}>
            <NextImage src={album.coverArt || AlbumPlaceholder} width={300} height={300} />
            <H3>{album.name}</H3>
            <p>{album.releaseDate}</p>
          </DivRoot>
        ))}
      </Main>
    </>
  )
}

export default ArtistPage
