/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const styles = {
  header: css`
    margin: 0;
    color: #ebebeb;
    font-size: 72px;
  `,
}

export const Subheader = ({ name }: { name: string }) => <h2 css={styles.header}>{name}</h2>
