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
    margin: 30px 30px 10px 30px;
    background-color: #f0f0f0;
    padding: 20px 20px 10px 20px;
    border-radius: 5px;
  `,
  coverArtThumb: css`
    display: inline-block;
  `,
  left: css`
    display: inline-block;

    img {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
  `,
  right: css`
    display: inline-block;

    img {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  `,
  name: css`
    margin: 0;
    font-size: 28px;
  `,
}

const coverArtSize = 100

export const GenreCard = ({ genreName, coverArts }: Props) => (
  <div css={styles.root}>
    <div css={styles.left}>
      <ImageLink
        href={`/app/genre/${genreName}`}
        imageSrc={coverArts[0]}
        width={coverArtSize}
        height={coverArtSize}
      />
    </div>
    <div css={styles.coverArtThumb}>
      <ImageLink
        href={`/app/genre/${genreName}`}
        imageSrc={coverArts[1]}
        width={coverArtSize}
        height={coverArtSize}
      />
    </div>
    <div css={styles.coverArtThumb}>
      <ImageLink
        href={`/app/genre/${genreName}`}
        imageSrc={coverArts[2]}
        width={coverArtSize}
        height={coverArtSize}
      />
    </div>
    <div css={styles.right}>
      <ImageLink
        href={`/app/genre/${genreName}`}
        imageSrc={coverArts[3]}
        width={coverArtSize}
        height={coverArtSize}
      />
    </div>
    <h3 css={styles.name}>{genreName}</h3>
  </div>
)
