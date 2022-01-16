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
        <h1>Hello</h1>
      </main>
    </>
  )
}

export default Page
