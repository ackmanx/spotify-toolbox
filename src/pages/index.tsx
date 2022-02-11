/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import Header from '../components/header/Header'
import CoolCatImage from '../components/images/cool-cat.png'
import { RootPage } from '../components/pages/RootPage'
import { ButtonImage } from '../components/shared/Image'
import { useAccessTokenTimer } from '../hooks/useAccessTokenTimer'
import dbConnect from '../lib/db'
import { _Artist, buildArtist, mArtist } from '../mongoose/Artist'
import { _User, mUser } from '../mongoose/User'
import { Many, One } from '../mongoose/types'
import { forceSerialization } from '../utils/force-serialization'
import { GetAll } from '../utils/server/spotify-web-api'

interface Props {
  artistsByGenre: Record<string, _Artist[]>
  viewedAlbums: string[]
  isTokenExpired: boolean
}

const RootNextPage: NextPage<Props> = ({ artistsByGenre, viewedAlbums, isTokenExpired }) => {
  useAccessTokenTimer()
  const { status } = useSession()

  const hasNoFollowedArtists = !Object.keys(artistsByGenre).length

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
        {status === 'unauthenticated' ? (
          <div>
            <h2>It looks like you are not signed in.</h2>
            <h2>Try harder.</h2>
            <ButtonImage src={CoolCatImage} onClick={() => {}} />
          </div>
        ) : isTokenExpired ? (
          <div>
            <h2>It looks like your Spotify access token expired.</h2>
            <h2>Better sign out and back in, like a boss.</h2>
            <ButtonImage src={CoolCatImage} onClick={() => {}} />
          </div>
        ) : (
          <>
            {hasNoFollowedArtists && (
              <div>
                <h2>It looks like you are not following any artists.</h2>
                <h2>Level up and try again.</h2>
                <ButtonImage src={CoolCatImage} onClick={() => {}} />
              </div>
            )}

            <RootPage artistsByGenre={artistsByGenre} viewedAlbums={viewedAlbums} />
          </>
        )}
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
  const tokenExpiresAtMs = (session?.expiresAt as number) * 1000
  const isTokenExpired = tokenExpiresAtMs - new Date().getTime() < 0

  if (!user || isTokenExpired) {
    return { props: { artistsByGenre: {}, viewedAlbums: [], isTokenExpired } }
  }

  // Update followed artists in case there's any new ones or any dropped off
  const followedArtists = await GetAll.followedArtists(session?.accessToken as string)

  const artists: Many<_Artist> = []
  const followedArtistsIDs: string[] = []

  followedArtists.forEach((artist) => {
    artists.push(buildArtist(artist))
    followedArtistsIDs.push(artist.id)
  })

  user.followedArtists = followedArtistsIDs
  await user.save()

  const artistsByGenre = artists.reduce((genres: Record<string, Many<_Artist>>, artist) => {
    if (!genres[artist.genre]) genres[artist.genre] = []

    genres[artist.genre].push(artist)

    return genres
  }, {})

  return {
    props: forceSerialization<Props>({
      artistsByGenre,
      viewedAlbums: user.viewedAlbums,
      isTokenExpired,
    }),
  }
}
