import styled from '@emotion/styled'
import { useRef, useState } from 'react'
import RefreshIcon from './RefreshIcon'
import { CSSTransition } from 'react-transition-group'

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
  & img:hover {
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
`

export const Genre = ({ name, onClick }: Props) => {
  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>('hidden')
  const refreshRef = useRef(null)

  const handleRefresh = async (event: any) => {
    // The containing div has a click handler to hide/close the genre
    event.stopPropagation()

    setRefreshStatus('processing')

    const response = await fetch(`/api/refresh/${name}`)
    console.log(777, await response.json()) /* delete */

    setRefreshStatus('hidden')
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

      <CSSTransition
        nodeRef={refreshRef}
        classNames='refresh_icon'
        in={refreshStatus === 'processing'}
        timeout={99999}
      >
        <Button onClick={handleRefresh}>
          <RefreshIcon ref={refreshRef} key='key' />
        </Button>
      </CSSTransition>
    </Div>
  )
}
