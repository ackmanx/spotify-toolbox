import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Header from '../components/header/Header'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Artist } from '../components/artists/Artist'
import { _Artist } from '../mongoose/Artist'
import { Genre } from '../components/genre/Genre'
import { ToastContainer } from 'react-toastify'

const Main = styled.main`
  text-align: center;
`

const Page: NextPage = () => {
  const { data } = useSession()
  const [genres, setGenres] = useState<Record<string, _Artist[]>>({})
  const [hiddenGenre, setHiddenGenre] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function doStuff() {
      const response = await fetch('/api/artists')
      const body: _Artist[] = await response.json()

      const genres = body.reduce((genres: Record<string, _Artist[]>, artist) => {
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

  return (
    <>
      <Head>
        <title>Toolbox</title>
      </Head>
      <ToastContainer />
      <Header />
      <Main>
        {Object.keys(genres)
          .sort()
          .map((genre) => (
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

export default Page
