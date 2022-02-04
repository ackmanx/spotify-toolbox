import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Header from '../../components/header/Header'
import styled from '@emotion/styled'
import { _Album, _Artist, mArtist } from '../../mongoose/Artist'
import NextImage from 'next/image'
import AlbumPlaceholder from '../../components/album/album-placeholder.png'
import { useAccessTokenTimer } from '../../hooks/useAccessTokenTimer'
import { ToastContainer } from 'react-toastify'
import dbConnect from '../../lib/db'
import { One } from '../../mongoose/types'
import { forceSerialization } from '../../utils/force-serialization'
import { _User, mUser } from '../../mongoose/User'
import { getSession } from 'next-auth/react'

type AlbumWithViewed = _Album & { isViewed: boolean }

interface Props {
  artist: _Artist
  albums: AlbumsByReleaseType
}

type AlbumsByReleaseType = Record<string, AlbumWithViewed[]>

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

const ArtistPage: NextPage<Props> = ({ artist, albums }) => {
  useAccessTokenTimer()

  if (!albums || !artist) return null

  return (
    <>
      <Head>
        <title>Toolbox - {artist.name}</title>
      </Head>
      <Header artist={artist} />
      <Main>
        <ToastContainer />
        <DivAlbumType>
          <H2>albums</H2>
        </DivAlbumType>
        {albums.album.map(
          (album) =>
            !album.isViewed && (
              <DivRoot key={album.id}>
                <NextImage src={album.coverArt || AlbumPlaceholder} width={300} height={300} />
                <H3>{album.name}</H3>
                <p>{album.releaseDate}</p>
              </DivRoot>
            )
        )}

        <DivAlbumType>
          <H2>singles</H2>
        </DivAlbumType>
        {albums.single.map(
          (single) =>
            !single.isViewed && (
              <DivRoot key={single.id}>
                <NextImage src={single.coverArt || AlbumPlaceholder} width={300} height={300} />
                <H3>{single.name}</H3>
                <p>{single.releaseDate}</p>
              </DivRoot>
            )
        )}
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
