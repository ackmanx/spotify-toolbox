/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { _Artist } from '../../mongoose/Artist'
import NoUserPicIcon from '../images/person-placeholder.png'
import { ButtonImage } from '../shared/Image'
import menuIcon from './menu-icon.png'
import signInIcon from './sign-in.png'
import signOutIcon from './sign-out.png'

interface Props {
  artist?: _Artist
}

const styles = {
  root: css`
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
  `,
  image: css`
    display: flex;
    align-items: center;
    margin-left: 10px;
  `,
}

const Component = ({ artist }: Props) => {
  const router = useRouter()
  const { data } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleOpenMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header css={styles.root}>
      <ButtonImage src={menuIcon} width={60} height={60} onClick={() => router.push('/')} />

      {isMenuOpen && (
        <div css={styles.image}>
          {data ? (
            <ButtonImage src={signOutIcon} width={40} height={40} onClick={() => signOut()} />
          ) : (
            <ButtonImage src={signInIcon} width={40} height={40} onClick={() => signIn()} />
          )}
        </div>
      )}

      {artist && <h3>{artist.name}</h3>}

      <ButtonImage
        src={data?.user?.image ?? NoUserPicIcon}
        width={40}
        height={40}
        onClick={handleOpenMenu}
      />
    </header>
  )
}

export default Component
