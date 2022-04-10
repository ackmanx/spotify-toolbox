/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const styles = {
  header: css`
    text-align: center;
    margin: 0;
    color: #cdcdcd;
    font-size: 48px;
    line-height: 48px; ;
  `,
}

export const Subheader = ({ name }: { name: string }) => <h2 css={styles.header}>{name}</h2>
