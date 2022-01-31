import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Header from '../components/header/Header'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Artist } from '../components/artists/Artist'
import { _Artist } from '../mongoose/Artist'
import { Genre } from '../components/genre/Genre'
import { toast, ToastContainer } from 'react-toastify'
import { InitResponse } from './api/init'
import { NotLoggedInImage } from '../components/images/NotLoggedInImage'
import { useRouter } from 'next/router'

const Main = styled.main`
  text-align: center;
`

const RootPage: NextPage = () => {
  const { data, status } = useSession()
  const router = useRouter()
  const [genres, setGenres] = useState<Record<string, _Artist[]>>({})
  const [accessTokenExpires, setAccessTokenExpires] = useState<number>()
  const [hiddenGenre, setHiddenGenre] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function doStuff() {
      const response = await fetch('/api/init')
      const body: InitResponse = await response.json()

      setAccessTokenExpires(body.user?.accessTokenExpires)

      const genres = body.artists.reduce((genres: Record<string, _Artist[]>, artist) => {
        if (!genres[artist.genre]) genres[artist.genre] = []

        genres[artist.genre].push(artist)

        return genres
      }, {})

      setGenres(genres)

      const defaultHiddenGenres: Record<string, boolean> = {}
      Object.keys(genres).forEach((genre) => (defaultHiddenGenres[genre] = true))
      setHiddenGenre(defaultHiddenGenres)
    }

    if (data) {
      doStuff()
    }
  }, [data])

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
