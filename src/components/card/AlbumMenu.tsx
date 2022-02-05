/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

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
}

export const AlbumMenu = ({ albumId, className, onClick, onViewedAlbum }: Props) => {
  return (
    <div css={styles.root} className={className} data-album-id={albumId} onClick={onClick}>
      <ButtonImage
        src={MarkAsViewedIcon}
        width={50}
        height={50}
        onClick={async (event) => {
          event.stopPropagation()
          //todo majerus: should be a POST probably
          await fetch(`/api/viewed/${albumId}`)
          onClick()
          onViewedAlbum(albumId)
        }}
      />
    </div>
  )
}
