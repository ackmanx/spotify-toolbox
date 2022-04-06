/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import { AppHeader } from '../components/app-header/AppHeader'
import { RootPage } from '../components/pages/RootPage'
import { CoolCat } from '../components/shared/CoolCat'
import { useAccessTokenTimer } from '../hooks/useAccessTokenTimer'

const RootNextPage: NextPage = () => {
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
      <RootPage />
    </>
  )
}

export default RootNextPage
