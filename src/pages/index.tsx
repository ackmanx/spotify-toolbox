import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import Header from '../components/header/Header'
import { useEffect } from 'react'
import styled from '@emotion/styled'

const Div = styled.div`
  display: inline-block;
  width: 300px;
  height: 300px;
  margin: 20px;
`
const Main = styled.main`
  text-align: center;
`

const Page: NextPage = () => {
  const { data: session, status } = useSession()

  useEffect(() => {
    // if (status === 'authenticated') {
    //   fetch('/api/spotify')
    //     .then((result) => result.json())
    //     .then((body) => console.log(777, body) /* delete */)
    // }
  }, [status])

  return (
    <>
      <Head>
        <title>Toolbox - Watcher</title>
      </Head>
      <Header />
      <Main>
        <Div>
          <Image src='https://i.scdn.co/image/ab67616d00001e021974dc9afcee4773e1606278' width={300} height={300} />
        </Div>
        <Div>
          <Image src='https://i.scdn.co/image/ab67616d00001e02ac15fab01ae304eea764f0b4' width={300} height={300} />
        </Div>
        <Div>
          <Image src='https://i.scdn.co/image/ab67616d00001e029166e9897c6a6b415f70f0c4' width={300} height={300} />
        </Div>
        <Div>
          <Image src='https://i.scdn.co/image/ab67616d00001e0273d8d28b27737c2c4847a2a9' width={300} height={300} />
        </Div>
        <Div>
          <Image src='https://i.scdn.co/image/ab67616d00001e0288e6c324ff93e944bfcb682e' width={300} height={300} />
        </Div>
      </Main>
    </>
  )
}

export default Page
