/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { _Album } from '../../mongoose/Artist'
import { ButtonImage, ImageLink } from '../shared/Image'
import MarkAsViewedIcon from './images/mark-as-viewed.png'
import OpenSpotifyIcon from './images/open-in-spotify.png'
import OpenWebIcon from './images/open-in-web.png'

interface Props {
  album: _Album
  className?: string //css prop
  onClick(): void
  onViewedAlbum(albumId: string): void
}

const styles = {
  root: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;

    & * {
      cursor: pointer;
    }
  `,
  top: css`
    flex-grow: 1;
    display: flex;
    align-items: center;
  `,
  icon: css`
    transform: scale(100%);
    transition: transform 0.1s linear;

    &:hover {
      transform: scale(110%);
      transition: transform 0.1s linear;
    }
  `,
  bottom: css`
    display: flex;
    margin-bottom: 5px;
    gap: 10px;
  `,
}

export const AlbumMenu = ({ album, className, onClick, onViewedAlbum }: Props) => {
  const ref = useRef(null)
  const [markViewedProcessing, setMarkViewedProcessing] = useState(false)

  return (
    <div css={styles.root} className={className} data-id={album.id} onClick={onClick}>
      <div css={styles.top}>
        <CSSTransition
          nodeRef={ref}
          classNames='mark_viewed'
          in={markViewedProcessing}
          timeout={99999}
        >
          <div ref={ref} css={styles.icon}>
            <ButtonImage
              src={MarkAsViewedIcon}
              width={50}
              height={50}
              onClick={async (event) => {
                event.stopPropagation()
                setMarkViewedProcessing(true)
                //todo majerus: should be a POST probably
                await fetch(`/api/viewed/${album.id}`)
                onClick()
                onViewedAlbum(album.id)
              }}
            />
          </div>
        </CSSTransition>
      </div>
      <div css={styles.bottom}>
        <div css={styles.icon}>
          <ImageLink href={album.spotifyUri} imageSrc={OpenSpotifyIcon} width={35} height={35} />
        </div>
        <div css={styles.icon}>
          <ImageLink href={album.spotifyWebUrl} imageSrc={OpenWebIcon} width={35} height={35} />
        </div>
      </div>
    </div>
  )
}
