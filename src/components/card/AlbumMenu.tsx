/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface Props {
  albumId: string
  className?: string //css prop
  onClick(): void
}

const styles = {
  root: css`
    border-radius: 5px;
  `,
}

export const AlbumMenu = ({ albumId, className, onClick }: Props) => {
  return (
    <div css={styles.root} className={className} data-album-id={albumId} onClick={onClick}>
      {albumId}
    </div>
  )
}
