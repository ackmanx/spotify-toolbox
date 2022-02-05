/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'

import { AlbumMenu } from '../../components/card/AlbumMenu'
import { Card } from '../../components/card/Card'
import Header from '../../components/header/Header'
import { useAccessTokenTimer } from '../../hooks/useAccessTokenTimer'
import dbConnect from '../../lib/db'
import { _Album, _Artist, mArtist } from '../../mongoose/Artist'
import { _User, mUser } from '../../mongoose/User'
import { One } from '../../mongoose/types'
import { forceSerialization } from '../../utils/force-serialization'

export type AlbumWithViewed = _Album & { isViewed: boolean }

interface Props {
  artist: _Artist
  albums: AlbumsByReleaseType
}

type AlbumsByReleaseType = Record<string, AlbumWithViewed[]>

const styles = {
  main: css`
    text-align: center;
  `,
  header: css`
    text-align: left;
    padding: 0 20px;

    h2 {
      margin: 0;
      color: #ebebeb;
      font-size: 72px;
    }
  `,
  albumContainer: css`
    display: inline-block;
    position: relative;
  `,
  menu: css`
    position: absolute;
    top: 5px;
    left: 5px;
    margin: 10px 20px;
    width: 290px;
    height: 290px;
    background-color: white;
  `,
}

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
      <main css={styles.main}>
        <ToastContainer />

        <div css={styles.header}>
          <h2>albums</h2>
        </div>
        {albums.album.map((album) => (
          <div key={album.id} css={styles.albumContainer}>
            <Card album={album} onClick={() => showAlbumMenu(album.id)} />
            {albumMenus[album.id] && (
              <AlbumMenu
                css={styles.menu}
                className={animations}
                albumId={album.id}
                onClick={() => showAlbumMenu(album.id)}
              />
            )}
          </div>
        ))}

        <div css={styles.header}>
          <h2>singles</h2>
        </div>
        {albums.single.map((single) => (
          <div key={single.id} css={styles.albumContainer}>
            <Card album={single} onClick={() => showAlbumMenu(single.id)} />
            {albumMenus[single.id] && (
              <AlbumMenu
                css={styles.menu}
                className={animations}
                albumId={single.id}
                onClick={() => showAlbumMenu(single.id)}
              />
            )}
          </div>
        ))}
      </main>
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
