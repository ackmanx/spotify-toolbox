/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import NextImage from 'next/image'

import { _Album } from '../../../mongoose/Album'
import AlbumPlaceholder from './images/album-placeholder.png'

interface Props {
  album: _Album
  onClick(): void
}

const styles = {
  root: css`
    width: 300px;
    margin: 10px 20px;
    overflow: hidden;

    & img {
      cursor: pointer;
      border-radius: 5px;
    }
  `,
  header: css`
    margin: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  `,
}

export const Album = ({ album, onClick }: Props) => {
  return (
    <div css={styles.root} key={album.id}>
      <NextImage
        src={album.coverArt || AlbumPlaceholder}
        width={300}
        height={300}
        onClick={onClick}
        unoptimized
      />
      <h3 css={styles.header}>{album.name}</h3>
      {album.releaseDate}
    </div>
  )
}
