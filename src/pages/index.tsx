/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import { AppHeader } from '../components/header/AppHeader'
import { RootPage } from '../components/pages/RootPage'
import { CoolCat } from '../components/shared/CoolCat'
import { useAccessTokenTimer } from '../hooks/useAccessTokenTimer'

const RootNextPage: NextPage = () => {
  useAccessTokenTimer()
  const { status } = useSession()

  if (status === 'loading') {
    return null
  }

  const isLoggedIn = status !== 'unauthenticated'

  return (
    <>
      <Head>
        <title>I Already Saw That</title>
      </Head>
      <ToastContainer />
      <AppHeader title='I Already Saw That' />
      <main
        css={css`
          text-align: center;
        `}
      >
        {isLoggedIn ? (
          <RootPage />
        ) : (
          <CoolCat header='It looks like you are not signed in.' subheader='Try harder.' />
        )}
      </main>
    </>
  )
}

export default RootNextPage
