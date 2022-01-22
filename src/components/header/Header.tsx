import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import menuIcon from './menu-icon.png'
import signInIcon from './sign-in.png'
import signOutIcon from './sign-out.png'
import { useState } from 'react'
import styled from '@emotion/styled'

const Header = styled.header`
  display: flex;
  padding: 10px 20px;
  background-color: ${(props) => (props.hasActiveToken ? 'none' : '#c00')};

  img {
    cursor: pointer;
  }
`
const DivImageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`

const Component = () => {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleOpenMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <Header>
      <Image src={menuIcon} width={60} height={60} onClick={handleOpenMenu} />

      {isMenuOpen && (
        <DivImageContainer>
          <div>
            <Image src={signOutIcon} width={40} height={40} onClick={() => signOut()} />
          </div>
          <div>
            <Image src={signInIcon} width={40} height={40} onClick={() => signIn()} />
          </div>
        </DivImageContainer>
      )}
    </Header>
  )
}

export default Component
