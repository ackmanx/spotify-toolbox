import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { getSession, useSession } from 'next-auth/react'
import Header from '../components/header/Header'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Artist } from '../components/artists/Artist'
import { _Artist, mArtist } from '../mongoose/Artist'
import { Genre } from '../components/genre/Genre'
import { toast, ToastContainer } from 'react-toastify'
import { NotLoggedInImage } from '../components/images/NotLoggedInImage'
import { useRouter } from 'next/router'
import dbConnect from '../lib/db'
import { FindOne } from '../mongoose/types'
import { _User, mUser } from '../mongoose/User'
import { forceSerialization } from '../utils/force-serialization'

interface Props {
  artistsByGenre: Record<string, _Artist[]>
  defaultHiddenGenres: Record<string, boolean>
  user: _User | null
}

const Main = styled.main`
  text-align: center;
`

const RootPage: NextPage<Props> = ({ user, artistsByGenre, defaultHiddenGenres }) => {
  const { data, status } = useSession()
  const router = useRouter()
  const [genres, setGenres] = useState<Record<string, _Artist[]>>(artistsByGenre)
  const [hiddenGenre, setHiddenGenre] = useState<Record<string, boolean>>(defaultHiddenGenres)

  const accessTokenExpires = user?.accessTokenExpires ?? 0

  useEffect(() => {
    if (accessTokenExpires) {
      const expirationTimeInMs = accessTokenExpires * 1000 - new Date().getTime()

      setTimeout(() => {
        toast.error(
          <>
            <p>Access token has expired</p>
            <p>Sign in again to get a new one</p>
          </>,
          {
            position: 'top-center',
            autoClose: false,
            hideProgressBar: true,
            theme: 'colored',
            onClick: () => router.push('/api/auth/signin'),
          }
        )
      }, expirationTimeInMs)
    }
  }, [router, accessTokenExpires])

  const handleGenreHide = (genre: string) =>
    setHiddenGenre((prevState) => ({
      ...prevState,
      [genre]: !prevState[genre],
    }))

  const handleGenreRefresh = (genre: string, artists: _Artist[]) =>
    setGenres((prevState) => ({
      ...prevState,
      [genre]: artists,
    }))

  const genresSorted = Object.keys(genres).sort()

  return (
    <>
      <Head>
        <title>Toolbox</title>
      </Head>
      <ToastContainer />
      <Header />
      <Main>
        {status === 'unauthenticated' && <NotLoggedInImage />}
        {genresSorted.map((genre) => (
          <div key={genre}>
            <Genre
              name={genre}
              onClick={() => handleGenreHide(genre)}
              onRefresh={handleGenreRefresh}
            />

            {hiddenGenre[genre] &&
              genres[genre].map((artist) => <Artist key={artist.id} artist={artist} />)}
          </div>
        ))}
      </Main>
    </>
  )
}

export default RootPage

interface ServerSideProps {
  props: {
    artistsByGenre: Record<string, _Artist[]>
    defaultHiddenGenres: Record<string, boolean>
    user: _User | null
  }
}

export const getServerSideProps: GetServerSideProps = async ({ req }): Promise<ServerSideProps> => {
  const session = await getSession({ req })
  await dbConnect()

  const user: FindOne<_User> = await mUser.findOne({ userId: session?.userId })
  const artists: _Artist[] = await mArtist.find({ id: { $in: user?.followedArtists } })

  const artistsByGenre = artists.reduce((genres: Record<string, _Artist[]>, artist) => {
    if (!genres[artist.genre]) genres[artist.genre] = []

    genres[artist.genre].push(artist)

    return genres
  }, {})

  const defaultHiddenGenres: Record<string, boolean> = {}
  Object.keys(artistsByGenre).forEach((genre) => (defaultHiddenGenres[genre] = true))

  return {
    props: forceSerialization({ user, artistsByGenre, defaultHiddenGenres }),
  }
}
