import { signIn, signOut, useSession } from 'next-auth/react'
import menuIcon from './menu-icon.png'
import signInIcon from './sign-in.png'
import signOutIcon from './sign-out.png'
import { useState } from 'react'
import styled from '@emotion/styled'
import { ButtonImage } from '../shared/Image'
import { useRouter } from 'next/router'
import { _Artist } from '../../mongoose/Artist'

interface Props {
  artist?: _Artist
}

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;

  img {
    cursor: pointer;
    border-radius: 100%;
  }

  h3 {
    font-size: 32px;
    margin: 0;
  }
`

const DivImageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`

const Component = ({ artist }: Props) => {
  const router = useRouter()
  const { data } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleOpenMenu = () => setIsMenuOpen(!isMenuOpen)

  if (!data) return null

  return (
    <Header>
      <ButtonImage src={menuIcon} width={60} height={60} onClick={() => router.push('/')} />

      {isMenuOpen && (
        <DivImageContainer>
          {data ? (
            <ButtonImage src={signOutIcon} width={40} height={40} onClick={() => signOut()} />
          ) : (
            <ButtonImage src={signInIcon} width={40} height={40} onClick={() => signIn()} />
          )}
        </DivImageContainer>
      )}

      {artist && <h3>{artist.name}</h3>}

      <ButtonImage src={data?.user?.image ?? ''} width={40} height={40} onClick={handleOpenMenu} />
    </Header>
  )
}

export default Component
