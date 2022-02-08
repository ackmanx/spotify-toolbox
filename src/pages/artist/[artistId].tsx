/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import Header from '../../components/header/Header'
import { ArtistPage } from '../../components/pages/ArtistPage'
import { useAccessTokenTimer } from '../../hooks/useAccessTokenTimer'
import dbConnect from '../../lib/db'
import { _Album, _Artist, buildAlbum, mArtist } from '../../mongoose/Artist'
import { _User, mUser } from '../../mongoose/User'
import { One } from '../../mongoose/types'
import { forceSerialization } from '../../utils/force-serialization'
import { GetAll } from '../../utils/server/spotify-web-api'

export type AlbumWithViewed = _Album & { isViewed: boolean }

interface Props {
  artist: _Artist
  albums: AlbumsByReleaseType
}

export type AlbumsByReleaseType = Record<string, AlbumWithViewed[]>

const ArtistNextPage: NextPage<Props> = ({ artist, albums }) => {
  useAccessTokenTimer()

  if (!albums || !artist) return null

  return (
    <>
      <Head>
        <title>Toolbox - {artist.name}</title>
      </Head>
      <Header artist={artist} />
      <main
        css={css`
          text-align: center;
        `}
      >
        <ToastContainer />

        <ArtistPage artist={artist} albumsByReleaseType={albums} />
      </main>
    </>
  )
}

export default ArtistNextPage

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

  if (!user || !artist) {
    throw new Error('User or artist not found in DB')
  }

  if (!artist.albums.length) {
    if (session?.isExpired) {
      return { props: { artist, albums: {} } }
    }

    const albums = await GetAll.albumsForArtist(session?.accessToken as string, artist)
    artist.albums = albums.map(buildAlbum)
    await artist.save()
  }

  const artistPojo = artist.toObject()

  const albums = artistPojo.albums.reduce(
    (albums: AlbumsByReleaseType, album) => {
      const isViewed = user.viewedAlbums.includes(album.id) ?? false
      albums[album.type].push({ ...album, isViewed })
      return albums
    },
    { single: [], album: [] }
  )

  return {
    props: forceSerialization<Props>({ artist, albums }),
  }
}
