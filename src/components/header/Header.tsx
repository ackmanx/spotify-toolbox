/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

import { AuthContext } from '../../AuthContext'
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
  profileContainer: css`
    position: relative;
  `,
  profileImage: (isExpired: boolean) =>
    isExpired
      ? css`
          &:before {
            content: ' ';
            width: 44px;
            height: 44px;
            border: 2px dashed red;
            position: absolute;
            border-radius: 100%;
            left: 2px;
            top: -3px;
          }
        `
      : null,
  image: css`
    display: flex;
    align-items: center;
    position: absolute;
    top: 45px;
  `,
}

const Component = ({ artist }: Props) => {
  const router = useRouter()
  const { data } = useSession()
  const { isTokenExpired } = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleOpenMenu = () => {
    if (isMenuOpen) {
      const el = document.querySelector(`[data-id="account-menu"]`)
      el?.classList.add('animate__flipOutX')

      setTimeout(() => setIsMenuOpen(false), 500)
    }

    setIsMenuOpen(true)
  }

  const animations = 'animate__animated animate__flipInX'

  return (
    <header css={styles.root}>
      <ButtonImage src={menuIcon} width={60} height={60} onClick={() => router.push('/')} />

      {artist && <h3>{artist.name}</h3>}

      <div css={styles.profileContainer}>
        <div css={styles.profileImage(isTokenExpired)}>
          <ButtonImage
            src={data?.user?.image ?? NoUserPicIcon}
            width={40}
            height={40}
            onClick={handleOpenMenu}
          />

          {isMenuOpen && (
            <div css={styles.image} className={animations} data-id='account-menu'>
              {data ? (
                <ButtonImage src={signOutIcon} width={40} height={40} onClick={() => signOut()} />
              ) : (
                <ButtonImage src={signInIcon} width={40} height={40} onClick={() => signIn()} />
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Component
