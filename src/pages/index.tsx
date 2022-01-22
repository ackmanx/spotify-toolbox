import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Header from '../components/header/Header'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Artists } from '../components/artists/Artists'
import { _Artist } from '../mongoose/Artist'

const Main = styled.main`
  text-align: center;
`

const Page: NextPage = () => {
  const { data } = useSession()
  const [followedArtists, setFollowedArtists] = useState<_Artist[]>([])

  useEffect(() => {
    if (data) {
      fetch('/api/followed-artists')
        .then((result) => result.json())
        .then((body) => setFollowedArtists(body))
    }
  }, [data])

  return (
    <>
      <Head>
        <title>Toolbox - Watcher</title>
      </Head>
      <Header />
      <Main>
        <Artists artists={followedArtists} />
      </Main>
    </>
  )
}

export default Page
