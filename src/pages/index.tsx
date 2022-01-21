import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Header from '../components/header/Header'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Artists } from '../components/artists/Artists'

export interface ArtistsInterface {
  id: string
  name: string
  coverArt: string
}

const Main$ = styled.main`
  text-align: center;
`

const Page: NextPage = () => {
  const { data, status } = useSession()
  const [followedArtists, setFollowedArtists] = useState<ArtistsInterface[]>([])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/followed-artists')
        .then((result) => result.json())
        .then((body) => setFollowedArtists(body))
    }
  }, [status])

  return (
    <>
      <Head>
        <title>Toolbox - Watcher</title>
      </Head>
      <Header />
      <Main$>
        <Artists artists={followedArtists} />
      </Main$>
    </>
  )
}

export default Page
