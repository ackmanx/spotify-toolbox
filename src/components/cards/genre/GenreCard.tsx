/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { ImageLink } from '../../shared/Image'

interface Props {
  genreName: string
  coverArts: string[]
}

const styles = {
  root: css`
    margin: 20px;
    font-size: 24px;
    background-color: #f5f5f5;

    transform: scale(100%);
    transition: transform 200ms;
    cursor: pointer;

    &:hover {
      transform: scale(105%);
      transition: transform 200ms;
    }

    a {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 30px;
    }
  `,
}

export const GenreCard = ({ genreName, coverArts }: Props) => (
  <div css={styles.root}>
    <ImageLink href={`/app/genre/${genreName}`} imageSrc={coverArts[0]} width={50} height={50}>
      {genreName}
    </ImageLink>
  </div>
)
