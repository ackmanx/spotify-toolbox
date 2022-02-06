/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'

import { Artist } from '../components/artists/Artist'
import { Genre } from '../components/genre/Genre'
import Header from '../components/header/Header'
import { NotLoggedInImage } from '../components/images/NotLoggedInImage'
import { RootPage } from '../components/pages/RootPage'
import { useAccessTokenTimer } from '../hooks/useAccessTokenTimer'
import dbConnect from '../lib/db'
import { _Artist, mArtist } from '../mongoose/Artist'
import { _User, mUser } from '../mongoose/User'
import { Many, One } from '../mongoose/types'
import { forceSerialization } from '../utils/force-serialization'

interface Props {
  artistsByGenre: Record<string, _Artist[]>
  viewedAlbums: string[]
}

const RootNextPage: NextPage<Props> = ({ artistsByGenre, viewedAlbums }) => {
  useAccessTokenTimer()
  const { status } = useSession()

  return (
    <>
      <Head>
        <title>Toolbox</title>
      </Head>
      <ToastContainer />
      <Header />
      <main
        css={css`
          text-align: center;
        `}
      >
        {status === 'unauthenticated' && <NotLoggedInImage />}
        <RootPage artistsByGenre={artistsByGenre} viewedAlbums={viewedAlbums} />
      </main>
    </>
  )
}

export default RootNextPage

interface ServerSideProps {
  props: Props
}

export const getServerSideProps: GetServerSideProps = async ({ req }): Promise<ServerSideProps> => {
  const session = await getSession({ req })
  await dbConnect()

  const user: One<_User> = await mUser.findOne({ userId: session?.userId })

  if (!user) {
    // Must not be logged in
    return { props: { artistsByGenre: {}, viewedAlbums: [] } }
  }

  const artists: Many<_Artist> = await mArtist.find({
    id: { $in: user.followedArtists },
  })

  const artistsByGenre = artists.reduce((genres: Record<string, Many<_Artist>>, artist) => {
    if (!genres[artist.genre]) genres[artist.genre] = []

    genres[artist.genre].push(artist)

    return genres
  }, {})

  return {
    props: forceSerialization<Props>({ artistsByGenre, viewedAlbums: user.viewedAlbums }),
  }
}
