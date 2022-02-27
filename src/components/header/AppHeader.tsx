/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useRouter } from 'next/router'

import { ButtonImage } from '../shared/Image'
import { Account } from './Account'
import AppLogo from './images/logo.png'

interface Props {
  title?: string
}

const styles = {
  root: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: white;
    box-shadow: 0 0 5px 0 #333;

    h3 {
      font-size: 32px;
      margin: 0;
    }
  `,
}

const Component = ({ title }: Props) => {
  const router = useRouter()

  return (
    <header css={styles.root}>
      <ButtonImage src={AppLogo} width={60} height={60} onClick={() => router.push('/')} />

      {title && <h3>{title}</h3>}

      <Account />
    </header>
  )
}

export default Component
