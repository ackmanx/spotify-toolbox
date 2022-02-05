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
import { useState } from 'react'
import { AlbumMenu } from '../../components/card/AlbumMenu'

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

const DivCardContainer = styled.div`
  display: inline-block;
  position: relative;
`

const AlbumMenu$ = styled(AlbumMenu)`
  position: absolute;
  top: 5px;
  left: 5px;
  margin: 10px 20px;
  width: 290px;
  height: 290px;
  background-color: white;
`

const ArtistPage: NextPage<Props> = ({ artist, albums }) => {
  useAccessTokenTimer()
  const [albumMenus, setAlbumMenus] = useState<Record<string, boolean>>({})

  if (!albums || !artist) return null

  const showAlbumMenu = (albumId: string) => {
    let timeout = 0

    if (albumMenus[albumId]) {
      const el = document.querySelector(`[data-album-id="${albumId}"]`)
      el?.classList.add('animate__fadeOutDown')
      timeout = 500
    }

    setTimeout(
      () =>
        setAlbumMenus((prevState) => ({
          ...prevState,
          [albumId]: !prevState[albumId],
        })),
      timeout
    )
  }

  const animations = 'animate__animated animate__fadeInUp animate__faster'

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
          <DivCardContainer key={album.id}>
            <Card album={album} onClick={() => showAlbumMenu(album.id)} />
            {albumMenus[album.id] && (
              <AlbumMenu$
                className={animations}
                albumId={album.id}
                onClick={() => showAlbumMenu(album.id)}
              />
            )}
          </DivCardContainer>
        ))}

        <AlbumTypeHeader>
          <h2>singles</h2>
        </AlbumTypeHeader>
        {albums.single.map((single) => (
          <DivCardContainer key={single.id}>
            <Card album={single} onClick={() => showAlbumMenu(single.id)} />
            {albumMenus[single.id] && (
              <AlbumMenu$
                className={animations}
                albumId={single.id}
                onClick={() => showAlbumMenu(single.id)}
              />
            )}
          </DivCardContainer>
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
