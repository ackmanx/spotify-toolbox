import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Header from '../components/header/Header'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Artist } from '../components/artists/Artist'
import { _Artist } from '../mongoose/Artist'
import { Genre } from '../components/genre/Genre'

const Main = styled.main`
  text-align: center;
`

const Page: NextPage = () => {
  const { data } = useSession()
  const [genres, setGenres] = useState<Record<string, _Artist[]>>({})

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
    }

    if (data) {
      doStuff()
    }
  }, [data])

  return (
    <>
      <Head>
        <title>Toolbox</title>
      </Head>
      <Header />
      <Main>
        {Object.keys(genres)
          .sort()
          .map((genre) => (
            <div key={genre}>
              <Genre name={genre} />
              {genres[genre].map((artist) => (
                <Artist key={artist.artistId} artist={artist} />
              ))}
            </div>
          ))}
      </Main>
    </>
  )
}

export default Page
