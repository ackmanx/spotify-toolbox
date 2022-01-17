import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import menuIcon from './menu-icon.png'
import { useState } from 'react'

const Component = () => {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleOpenMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header>
      <Image src={menuIcon} width={50} height={50} onClick={handleOpenMenu} />

      {isMenuOpen && (
        <div>
          Signed in as {session?.user?.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
          <button onClick={() => signIn()}>Sign in again (to get new token)</button>
        </div>
      )}
    </header>
  )
}

export default Component
