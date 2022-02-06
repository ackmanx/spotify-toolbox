/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { ButtonImage, ImageLink } from '../shared/Image'
import MarkAsViewedIcon from './images/mark-as-viewed.png'
import OpenSpotifyIcon from './images/open-in-spotify.png'
import OpenWebIcon from './images/open-in-web.png'

interface Props {
  albumId: string
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
  bottom: css`
    display: flex;
    margin-bottom: 5px;
  `,
  icon: css`
    &:hover {
      filter: invert(100%);
    }
  `,
}

export const AlbumMenu = ({ albumId, className, onClick, onViewedAlbum }: Props) => {
  const ref = useRef(null)
  const [markViewedProcessing, setMarkViewedProcessing] = useState(false)

  return (
    <div css={styles.root} className={className} data-album-id={albumId} onClick={onClick}>
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
                await fetch(`/api/viewed/${albumId}`)
                onClick()
                onViewedAlbum(albumId)
              }}
            />
          </div>
        </CSSTransition>
      </div>
      <div css={styles.bottom}>
        <div ref={ref} css={styles.icon}>
          <ImageLink
            //todo majerus: need to add links to albums in db, then add here
            href={''}
            imageSrc={OpenSpotifyIcon}
            width={40}
            height={40}
          />
        </div>
        <div ref={ref} css={styles.icon}>
          <ImageLink href={''} imageSrc={OpenWebIcon} width={40} height={40} />
        </div>
      </div>
    </div>
  )
}
