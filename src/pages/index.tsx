import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/react'

const Page: NextPage = () => {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>Toolbox - Watcher</title>
      </Head>
      <header>
        {session && (
          <div>
            Signed in as {session.user?.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
            <button onClick={() => signIn()}>Sign in again (to get new token)</button>
          </div>
        )}
        {!session && (
          <div>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
          </div>
        )}
      </header>
      <main>
        <a href='/api/spotify'>API endpoint</a>
      </main>
    </>
  )
}

export default Page
