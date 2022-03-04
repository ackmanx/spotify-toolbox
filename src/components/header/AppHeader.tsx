/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useRouter } from 'next/router'

import { _Artist } from '../../mongoose/Artist'
import { ButtonImage } from '../shared/Image'
import { Account } from './Account'
import { RefreshButton } from './RefreshButton'
import AppLogo from './images/logo.png'

interface Props {
  // Need to know all the artists when on genre page so can pass the IDs to the server to update
  artists?: _Artist[]
  title?: string
  isRefreshable?: boolean
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

    h3 {
      font-size: 32px;
      margin: 0;
    }
  `,
  centerGroup: css`
    display: flex;
    align-items: end;
  `,
}

export const AppHeader = ({ artists = [], title, isRefreshable }: Props) => {
  const router = useRouter()
  const artistIDs = artists.map((artist) => artist.id)

  return (
    <header css={styles.root}>
      <ButtonImage src={AppLogo} width={60} height={60} onClick={() => router.push('/')} />

      <div css={styles.centerGroup}>
        {title && (
          <>
            <h3>{title}</h3>
            {isRefreshable && <RefreshButton artistIDs={artistIDs} />}
          </>
        )}
      </div>

      <Account />
    </header>
  )
}
