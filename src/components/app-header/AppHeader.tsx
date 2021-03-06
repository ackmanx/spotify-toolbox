/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useRouter } from 'next/router'

import { _Artist } from '../../mongoose/Artist'
import { ButtonImage } from '../shared/Image'
import { Account } from './Account'
import { BulkAddToPlaylistButton } from './BulkAddToPlaylistButton'
import { BulkMarkAsViewedButton } from './BulkMarkAsViewedButton'
import { RefreshButton } from './RefreshButton'
import AppLogo from './images/logo.png'

interface Props {
  // Necessary for refreshing artist on genre and artist pages
  artists?: _Artist[]
  // Necessary for bulk operations on an artist page
  albumIDs?: string[]
  title?: string
  isArtistPage?: boolean
  isRefreshable?: boolean
}

const styles = {
  root: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
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
  leftGroup: css`
    display: flex;
    align-items: center;
  `,
}

export const AppHeader = ({
  artists = [],
  albumIDs,
  title,
  isRefreshable,
  isArtistPage,
}: Props) => {
  const router = useRouter()
  const artistIDs = artists.map((artist) => artist.id)

  return (
    <header css={styles.root}>
      <div css={styles.leftGroup}>
        <ButtonImage src={AppLogo} width={60} height={60} onClick={() => router.push('/')} />
      </div>

      <div css={styles.centerGroup}>
        {title && (
          <>
            <h3>{title}</h3>
            {isRefreshable && <RefreshButton artistIDs={artistIDs} />}
            {isArtistPage && (
              <>
                <BulkAddToPlaylistButton artistID={artistIDs[0]} albumIDs={albumIDs ?? []} />
                <BulkMarkAsViewedButton artistID={artistIDs[0]} albumIDs={albumIDs ?? []} />
              </>
            )}
          </>
        )}
      </div>

      <Account />
    </header>
  )
}
