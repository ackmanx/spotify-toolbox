import { signIn, signOut, useSession } from 'next-auth/react'

const Component = () => {
  const { data: session } = useSession()

  return (
    <header>
      <div>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <button onClick={() => signIn()}>Sign in again (to get new token)</button>
      </div>
    </header>
  )
}

export default Component
