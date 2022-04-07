/** @jsxImportSource @emotion/react */
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import { GenreListPage } from '../components/pages/GenreListPage/GenreListPage'
import { useAccessTokenTimer } from '../hooks/useAccessTokenTimer'

const GenreListNextPage: NextPage = () => {
  useAccessTokenTimer()
  const { status } = useSession()

  if (status === 'loading') {
    return null
  }

  return (
    <>
      <Head>
        <title>I Already Saw That</title>
      </Head>
      <ToastContainer />
      <GenreListPage />
    </>
  )
}

export default GenreListNextPage
