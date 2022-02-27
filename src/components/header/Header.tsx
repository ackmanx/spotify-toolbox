/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

import { AuthContext } from '../../AuthContext'
import { ButtonImage } from '../shared/Image'
import NoUserPicIcon from '../shared/images/person-placeholder.png'
import followIcon from './images/following.png'
import menuIcon from './images/logo.png'
import signInIcon from './images/sign-in.png'
import signOutIcon from './images/sign-out.png'

interface Props {
  title?: string
}

const styles = {
  root: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: white;
    box-shadow: 0 0 5px 0 #333;

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
    background-color: white;
    z-index: 100;
  `,
}

const Component = ({ title }: Props) => {
  const router = useRouter()
  const { data, status } = useSession()
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

      {title && <h3>{title}</h3>}

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
              {status === 'authenticated' ? (
                <ButtonImage
                  src={signOutIcon}
                  width={40}
                  height={40}
                  onClick={() =>
                    signOut({
                      callbackUrl: window.location.origin,
                    })
                  }
                />
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
