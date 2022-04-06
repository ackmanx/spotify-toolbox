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
    background-color: #e8e8e8;
    padding: 20px 20px 10px 20px;
    border-radius: 5px;
  `,
  topLeft: css`
    display: inline-block;

    img {
      border-top-left-radius: 5px;
    }
  `,
  topRight: css`
    display: inline-block;

    img {
      border-top-right-radius: 5px;
    }
  `,
  bottomLeft: css`
    display: inline-block;

    img {
      border-bottom-left-radius: 5px;
    }
  `,
  bottomRight: css`
    display: inline-block;

    img {
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
    <div css={styles.topLeft}>
      <ImageLink
        href={`/app/genre/${genreName}`}
        imageSrc={coverArts[0]}
        width={coverArtSize}
        height={coverArtSize}
      />
    </div>
    <div css={styles.topRight}>
      <ImageLink
        href={`/app/genre/${genreName}`}
        imageSrc={coverArts[1]}
        width={coverArtSize}
        height={coverArtSize}
      />
    </div>
    <div css={styles.bottomLeft}>
      <ImageLink
        href={`/app/genre/${genreName}`}
        imageSrc={coverArts[2]}
        width={coverArtSize}
        height={coverArtSize}
      />
    </div>
    <div css={styles.bottomRight}>
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
