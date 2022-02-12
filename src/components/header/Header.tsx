/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

import { AuthContext } from '../../AuthContext'
import { _Artist } from '../../mongoose/Artist'
import NoUserPicIcon from '../images/person-placeholder.png'
import { ButtonImage } from '../shared/Image'
import followIcon from './images/following.png'
import menuIcon from './images/menu.png'
import signInIcon from './images/sign-in.png'
import signOutIcon from './images/sign-out.png'

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
  menu: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
      el?.classList.add('animate__bounceOut')

      setTimeout(() => setIsMenuOpen(false), 500)
    }

    setIsMenuOpen(true)
  }

  const animations = 'animate__animated animate__bounceIn'

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
            <div css={styles.menu} className={animations} data-id='account-menu'>
              {data ? (
                <ButtonImage src={signOutIcon} width={40} height={40} onClick={() => signOut()} />
              ) : (
                <ButtonImage src={signInIcon} width={40} height={40} onClick={() => signIn()} />
              )}
              <ButtonImage
                src={followIcon}
                width={40}
                height={40}
                onClick={() => console.log('')}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Component
