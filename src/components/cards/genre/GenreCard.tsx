/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { ImageLink } from '../../shared/Image'

interface Props {
  genreName: string
  coverArts: string[]
}

const styles = {
  root: css`
    display: inline-block;
    width: 300px;
    height: 300px;
    margin: 20px;
  `,
}

export const GenreCard = ({ genreName, coverArts }: Props) => (
  <div css={styles.root}>
    <ImageLink href={`/app/genre/${genreName}`} imageSrc={coverArts[0]} width={150} height={150} />
    <ImageLink href={`/app/genre/${genreName}`} imageSrc={coverArts[1]} width={150} height={150} />
    <ImageLink href={`/app/genre/${genreName}`} imageSrc={coverArts[2]} width={150} height={150} />
    <ImageLink href={`/app/genre/${genreName}`} imageSrc={coverArts[3]} width={150} height={150} />
    <h3>{genreName}</h3>
  </div>
)
