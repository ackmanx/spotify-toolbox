/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useContext, useState } from 'react'

import { AuthContext } from '../../AuthContext'
import { ButtonImage } from '../shared/Image'
import NoUserPicIcon from '../shared/images/person-placeholder.png'
import signInIcon from './images/sign-in.png'
import signOutIcon from './images/sign-out.png'

const styles = {
  root: css`
    position: relative;

    img {
      cursor: pointer;
      border-radius: 100%;
    }
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
            top: -3px;
          }
        `
      : null,
  menu: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 50px; //width = number of icons in account menu * 50
    position: absolute;
    top: 0;
    left: -55px; //width + 5
    background-color: white;
    z-index: 100;
    gap: 10px;
  `,
}

export const Account = () => {
  const { data, status } = useSession()
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
    <div css={styles.root}>
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
                disablePadding
                onClick={() =>
                  signOut({
                    callbackUrl: window.location.origin,
                  })
                }
              />
            ) : (
              <ButtonImage
                src={signInIcon}
                width={40}
                height={40}
                disablePadding
                onClick={() => signIn()}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
