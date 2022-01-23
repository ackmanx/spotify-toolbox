import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Header from '../components/header/Header'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Artists } from '../components/artists/Artists'
import { _Artist } from '../mongoose/Artist'
import { Genres } from '../components/genres/Genres'

const Main = styled.main`
  text-align: center;
`

const Page: NextPage = () => {
  const { data } = useSession()
  const [artists, setArtists] = useState<_Artist[]>([])

  useEffect(() => {
    if (data) {
      fetch('/api/artists')
        .then((result) => result.json())
        .then((body) => setArtists(body))
    }
  }, [data])

  return (
    <>
      <Head>
        <title>Toolbox - Watcher</title>
      </Head>
      <Header />
      <Main>
        <Genres artists={artists} />
        <Artists artists={artists} />
      </Main>
    </>
  )
}

export default Page
