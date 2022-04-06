/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { ImageLink } from '../../shared/Image'

interface Props {
  genreName: string
  coverArts: string[]
}

const styles = {
  root: css`
    // To allow each genre card to autowrap on the page
    display: inline-block;
    width: 200px;
    height: 200px;
    margin: 20px;
  `,
  top: css`
    margin-bottom: -5px;
  `,
}

const coverArtSize = 100

export const GenreCard = ({ genreName, coverArts }: Props) => (
  <div css={styles.root}>
    <div css={styles.top}>
      <ImageLink
        href={`/app/genre/${genreName}`}
        imageSrc={coverArts[0]}
        width={coverArtSize}
        height={coverArtSize}
      />
      <ImageLink
        href={`/app/genre/${genreName}`}
        imageSrc={coverArts[1]}
        width={coverArtSize}
        height={coverArtSize}
      />
    </div>
    <div>
      <ImageLink
        href={`/app/genre/${genreName}`}
        imageSrc={coverArts[2]}
        width={coverArtSize}
        height={coverArtSize}
      />
      <ImageLink
        href={`/app/genre/${genreName}`}
        imageSrc={coverArts[3]}
        width={coverArtSize}
        height={coverArtSize}
      />
    </div>
    <h3>{genreName}</h3>
  </div>
)
