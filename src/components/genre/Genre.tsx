import styled from '@emotion/styled'
import { _Artist } from '../../mongoose/Artist'
import { useState } from 'react'
import { ButtonImage } from '../shared/Image'
import refreshIcon from './refresh-icon.png'

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

export const Genre = ({ name, onClick }: Props) => {
  const [refreshButton, setRefreshButton] = useState<RefreshStatus>('hidden')

  const handleRefresh = async () => {
    setRefreshButton('processing')

    const response = await fetch(`/api/refresh/${name}`)
    console.log(777, await response.json()) /* delete */

    setRefreshButton('hidden')
  }

  return (
    <Div
      onMouseEnter={() =>
        setRefreshButton(refreshButton === 'processing' ? 'processing' : 'visible')
      }
      onMouseLeave={() =>
        setRefreshButton(refreshButton === 'processing' ? 'processing' : 'hidden')
      }
      onClick={onClick}
    >
      <H2>{name}</H2>
      {(refreshButton === 'visible' || refreshButton === 'processing') && (
        <ButtonImage src={refreshIcon} width={40} height={40} onClick={handleRefresh} />
      )}
    </Div>
  )
}
