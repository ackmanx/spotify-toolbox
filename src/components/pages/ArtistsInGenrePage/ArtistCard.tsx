/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { _Artist } from '../../../mongoose/Artist'
import { ImageLink } from '../../shared/Image'
import ArtistPlaceholder from '../../shared/images/person-placeholder.png'

interface Props {
  artist: _Artist
}

const styles = {
  root: css`
    display: inline-block;
    width: 300px;
    height: 300px;
    margin: 20px;

    & img {
      border-radius: 5px;
    }
  `,
  image: css`
    transform: scale(100%);
    transition: transform 200ms;
    cursor: pointer;

    &:hover {
      transform: scale(108%);
      transition: transform 200ms;
    }

    img {
      object-fit: cover;
    }
  `,
}

export const ArtistCard = ({ artist }: Props) => {
  return (
    <div css={styles.root}>
      <div css={styles.image}>
        <ImageLink
          href={`/app/artist/${artist.id}`}
          imageSrc={artist.coverArt || ArtistPlaceholder}
          width={300}
          height={300}
        />
      </div>
      <h3>{artist.name}</h3>
    </div>
  )
}
