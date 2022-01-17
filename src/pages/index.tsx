import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import Header from '../components/header/Header'
import { useEffect } from 'react'

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
      <main>
      </main>
    </>
  )
}

export default Page
