/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { CSSTransition } from 'react-transition-group'

import { _Artist } from '../../mongoose/Artist'
import { ButtonImage } from '../shared/Image'
import RefreshIcon from './refresh-icon.png'

interface Props {
  name: string
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
      color: #666;
    }
  `,
  header: css`
    margin: 0;
    color: #ebebeb;
    font-size: 72px;
  `,
  button: css`
    position: relative;
    top: 10px;
  `,
}

export const Genre = ({ name }: Props) => {
  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>('hidden')
  const refreshRef = useRef(null)

  const handleRefresh = async (event: any) => {
    // The containing div has a click handler to hide/close the genre
    event.stopPropagation()

    setRefreshStatus('processing')

    try {
      const response = await fetch(`/api/refresh/${name}`)

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message, { position: 'top-center', autoClose: false })
        return
      }

      window.location.reload()
    } catch (error: any) {
      toast.error(error.message, { position: 'top-center', autoClose: false })
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
    >
      <h2 css={styles.header}>{name}</h2>

      {(refreshStatus === 'visible' || refreshStatus === 'processing') && (
        <CSSTransition
          nodeRef={refreshRef}
          classNames='refresh_icon'
          in={refreshStatus === 'processing'}
          timeout={99999}
        >
          <div ref={refreshRef} css={styles.button}>
            <ButtonImage
              src={RefreshIcon}
              width={40}
              height={40}
              onClick={handleRefresh}
              disabled={refreshStatus === 'processing'}
            />
          </div>
        </CSSTransition>
      )}
    </div>
  )
}
