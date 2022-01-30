import styled from '@emotion/styled'
import { useRef, useState } from 'react'
import RefreshIcon from './RefreshIcon'
import { CSSTransition } from 'react-transition-group'
import { toast } from 'react-toastify'

interface Props {
  name: string
  onClick(): void
}

type RefreshStatus = 'hidden' | 'visible' | 'processing'

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  &:hover,
  & svg:hover {
    cursor: pointer;
  }
`

const H2 = styled.h2`
  margin: 0;
  color: #ebebeb;
  font-size: 72px;
`

const Button = styled.button`
  background-color: transparent;
  border: none;
  position: relative;
  top: 5px;
`

export const Genre = ({ name, onClick }: Props) => {
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
            <p>Your access token probably expired.</p>
            <p>Sign out then back in to get a new one.</p>
          </>,
          { position: 'top-center' }
        )
      }
    } catch (error: any) {
      toast.error(error.message, { position: 'top-center' })
    } finally {
      setRefreshStatus('hidden')
    }
  }

  return (
    <Div
      onMouseEnter={() =>
        setRefreshStatus(refreshStatus === 'processing' ? 'processing' : 'visible')
      }
      onMouseLeave={() =>
        setRefreshStatus(refreshStatus === 'processing' ? 'processing' : 'hidden')
      }
      onClick={onClick}
    >
      <H2>{name}</H2>

      {(refreshStatus === 'visible' || refreshStatus === 'processing') && (
        <CSSTransition
          nodeRef={refreshRef}
          classNames='refresh_icon'
          in={refreshStatus === 'processing'}
          timeout={99999}
        >
          <Button onClick={handleRefresh} disabled={refreshStatus === 'processing'}>
            <RefreshIcon ref={refreshRef} key='key' />
          </Button>
        </CSSTransition>
      )}
    </Div>
  )
}
