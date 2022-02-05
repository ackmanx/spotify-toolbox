/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { ButtonImage } from '../shared/Image'
import MarkAsViewedIcon from './images/mark-as-viewed.png'

interface Props {
  albumId: string
  className?: string //css prop
  onClick(): void
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

export const AlbumMenu = ({ albumId, className, onClick }: Props) => {
  return (
    <div css={styles.root} className={className} data-album-id={albumId} onClick={onClick}>
      <ButtonImage
        src={MarkAsViewedIcon}
        width={50}
        height={50}
        onClick={(event) => {
          event.stopPropagation()
          console.log('albumId', albumId)
        }}
      />
    </div>
  )
}
