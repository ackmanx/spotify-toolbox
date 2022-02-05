/** @jsxImportSource @emotion/react */
import NextImage from 'next/image'
import AlbumPlaceholder from './album-placeholder.png'
import { AlbumWithViewed } from '../../pages/artist/[artistId]'
import { css } from '@emotion/react'

interface Props {
  album: AlbumWithViewed
  onClick(): void
}

const styles = {
  root: css`
    width: 300px;
    margin: 10px 20px;
    overflow: hidden;
  `,
  header: css`
    margin: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  `,
}

export const Card = ({ album, onClick }: Props) => {
  if (album.isViewed) {
    return null
  }

  return (
    <div css={styles.root} key={album.id}>
      <NextImage
        src={album.coverArt || AlbumPlaceholder}
        width={300}
        height={300}
        onClick={onClick}
      />
      <h3 css={styles.header}>{album.name}</h3>
      {album.releaseDate}
    </div>
  )
}
