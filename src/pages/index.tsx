/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import Header from '../components/header/Header'
import { RootPage } from '../components/pages/RootPage'
import { CoolCat } from '../components/shared/CoolCat'
import { useAccessTokenTimer } from '../hooks/useAccessTokenTimer'
import dbConnect from '../lib/db'
import { _User, mUser } from '../mongoose/User'
import { forceSerialization } from '../utils/force-serialization'

interface Props {
  user: _User | null
}

const RootNextPage: NextPage<Props> = ({ user }) => {
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
        <RootPage user={user} />
      </main>
    </>
  )
}

export default RootNextPage

interface ServerSideProps {
  props: Props
}

export const getServerSideProps: GetServerSideProps = async ({ req }): Promise<ServerSideProps> => {
  const session = await getSession({ req })
  await dbConnect()

  const user = await mUser.findOne({ userId: session?.userId })

  return {
    props: forceSerialization<Props>({ user }),
  }
}
