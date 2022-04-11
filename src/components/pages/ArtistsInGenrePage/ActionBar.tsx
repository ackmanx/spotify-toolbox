/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useRouter } from 'next/router'

interface Props {}

const styles = {
  root: css`
    display: flex;
    justify-content: space-between;
    padding: 15px 10px 0 10px;
  `,
  button: css`
    background-color: #eee;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    padding: 10px;

    &:hover {
      background-color: #3e3e3e;
      color: white;
    }
  `,
}

export const ActionBar = ({}: Props) => {
  const router = useRouter()

  return (
    <div css={styles.root}>
      <button css={styles.button} onClick={() => router.back()}>
        Back
      </button>
      <button css={styles.button}>Refresh Genre</button>
    </div>
  )
}
