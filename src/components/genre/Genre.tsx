/** @jsxImportSource @emotion/react */
import { useRef, useState } from 'react'
import RefreshIcon from './RefreshIcon'
import { CSSTransition } from 'react-transition-group'
import { toast } from 'react-toastify'
import { _Artist } from '../../mongoose/Artist'
import { css } from '@emotion/react'

interface Props {
  name: string
  onClick(): void
  onRefresh(genre: string, artists: _Artist[]): void
}

type RefreshStatus = 'hidden' | 'visible' | 'processing'

const styles = {
  root: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    &:hover,
    & svg:hover {
      cursor: pointer;
    }

    &:hover h2:first-letter {
      color: #000;
    }
  `,
  header: css`
    margin: 0;
    color: #ebebeb;
    font-size: 72px;
  `,
  button: css`
    background-color: transparent;
    border: none;
    position: relative;
    top: 10px;
  `,
}

export const Genre = ({ name, onClick, onRefresh }: Props) => {
  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>('hidden')
  const refreshRef = useRef(null)

  const handleRefresh = async (event: any) => {
    // The containing div has a click handler to hide/close the genre
    event.stopPropagation()

    setRefreshStatus('processing')

    try {
      const response = await fetch(`/api/refresh/${name}`)

      if (!response.ok) {
        toast.error(
          <>
            <p>Access token probably expired</p>
            <p>Sign in again to get a new one</p>
          </>,
          { position: 'top-center', theme: 'colored' }
        )
        return
      }

      onRefresh(name, await response.json())
    } catch (error: any) {
      toast.error(error.message, { position: 'top-center' })
    } finally {
      setRefreshStatus('hidden')
    }
  }

  return (
    <div
      css={styles.root}
      onMouseEnter={() =>
        setRefreshStatus(refreshStatus === 'processing' ? 'processing' : 'visible')
      }
      onMouseLeave={() =>
        setRefreshStatus(refreshStatus === 'processing' ? 'processing' : 'hidden')
      }
      onClick={onClick}
    >
      <h2 css={styles.header}>{name}</h2>

      {(refreshStatus === 'visible' || refreshStatus === 'processing') && (
        <CSSTransition
          nodeRef={refreshRef}
          classNames='refresh_icon'
          in={refreshStatus === 'processing'}
          timeout={99999}
        >
          <button
            css={styles.button}
            onClick={handleRefresh}
            disabled={refreshStatus === 'processing'}
          >
            <RefreshIcon ref={refreshRef} key='key' />
          </button>
        </CSSTransition>
      )}
    </div>
  )
}
