/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import Header from '../components/header/AppHeader'
import { RootPage } from '../components/pages/RootPage'
import { CoolCat } from '../components/shared/CoolCat'
import { useAccessTokenTimer } from '../hooks/useAccessTokenTimer'

const RootNextPage: NextPage = () => {
  useAccessTokenTimer()
  const { status } = useSession()

  return (
    <>
      <Head>
        <title>Toolbox</title>
      </Head>
      <ToastContainer />
      <Header />
      <main
        css={css`
          text-align: center;
        `}
      >
        {status === 'unauthenticated' && (
          <CoolCat header='It looks like you are not signed in.' subheader='Try harder.' />
        )}
        <RootPage />
      </main>
    </>
  )
}

export default RootNextPage
