/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { ButtonImage } from '../shared/Image'
import MarkAsViewedIcon from './images/mark-as-viewed.png'

interface Props {
  albumId: string
  className?: string //css prop
  onClick(): void
  onViewedAlbum(albumId: string): void
}

const styles = {
  root: css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;

    & * {
      cursor: pointer;
    }
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
      <CSSTransition
        nodeRef={ref}
        classNames='mark_viewed'
        in={markViewedProcessing}
        timeout={99999}
      >
        <span ref={ref} css={styles.icon}>
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
        </span>
      </CSSTransition>
    </div>
  )
}
