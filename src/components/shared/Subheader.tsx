/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const styles = {
  header: css`
    text-align: center;
    margin: 10px;
    color: #cdcdcd;
    font-size: 48px;
  `,
}

export const Subheader = ({ name }: { name: string }) => <h2 css={styles.header}>{name}</h2>
