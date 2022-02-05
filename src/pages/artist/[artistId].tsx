import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Header from '../../components/header/Header'
import styled from '@emotion/styled'
import { _Album, _Artist, mArtist } from '../../mongoose/Artist'
import { useAccessTokenTimer } from '../../hooks/useAccessTokenTimer'
import { ToastContainer } from 'react-toastify'
import dbConnect from '../../lib/db'
import { One } from '../../mongoose/types'
import { forceSerialization } from '../../utils/force-serialization'
import { _User, mUser } from '../../mongoose/User'
import { getSession } from 'next-auth/react'
import { Card } from '../../components/card/Card'

export type AlbumWithViewed = _Album & { isViewed: boolean }

interface Props {
  artist: _Artist
  albums: AlbumsByReleaseType
}

type AlbumsByReleaseType = Record<string, AlbumWithViewed[]>

const Main = styled.main`
  text-align: center;
`

const AlbumTypeHeader = styled.div`
  text-align: left;
  padding: 0 20px;

  h2 {
    margin: 0;
    color: #ebebeb;
    font-size: 72px;
  }
`

const ArtistPage: NextPage<Props> = ({ artist, albums }) => {
  useAccessTokenTimer()

  if (!albums || !artist) return null

  const showAlbumMenu = () => {
    console.log(777, 'show') /* delete */
  }

  return (
    <>
      <Head>
        <title>Toolbox - {artist.name}</title>
      </Head>
      <Header artist={artist} />
      <Main>
        <ToastContainer />

        <AlbumTypeHeader>
          <h2>albums</h2>
        </AlbumTypeHeader>
        {albums.album.map((album) => (
          <Card key={album.id} album={album} onClick={showAlbumMenu} />
        ))}

        <AlbumTypeHeader>
          <h2>singles</h2>
        </AlbumTypeHeader>
        {albums.single.map((single) => (
          <Card key={single.id} album={single} onClick={showAlbumMenu} />
        ))}
      </Main>
    </>
  )
}

export default ArtistPage

interface ServerSideProps {
  props: Props
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}): Promise<ServerSideProps> => {
  const session = await getSession({ req })
  await dbConnect()

  const user: One<_User> = await mUser.findOne({ id: session?.userId })
  const artist: One<_Artist> = await mArtist.findOne({ id: query.artistId })
  const artistPojo = artist?.toObject()

  const albums = artistPojo?.albums.reduce(
    (albums: AlbumsByReleaseType, album) => {
      const isViewed = user?.viewedAlbums.includes(album.id) ?? false
      albums[album.type].push({ ...album, isViewed })
      return albums
    },
    { single: [], album: [] }
  )

  return {
    props: forceSerialization({ artist, albums }),
  }
}
