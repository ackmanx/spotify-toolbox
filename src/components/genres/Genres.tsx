import styled from '@emotion/styled'
import { _Artist } from '../../mongoose/Artist'
import { useState } from 'react'
import { Image } from '../shared/Image'
import refreshIcon from './refresh-icon.png'

interface Props {
  artists: _Artist[]
}

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  &:hover {
    background-color: #efefef;

    & h2 {
      color: white;
    }
  }

  & img:hover {
    cursor: pointer;
  }
`

const H2 = styled.h2`
  margin: 0;
  color: #ebebeb;
  font-size: 72px;
`

export const Genres = ({ artists }: Props) => {
  const [showRefreshButton, setShowRefreshButton] = useState(false)

  if (!artists.length) {
    return null
  }

  return (
    <Div
      onMouseEnter={() => setShowRefreshButton(true)}
      onMouseLeave={() => setShowRefreshButton(false)}
    >
      <H2>Industrial Metal</H2>
      {showRefreshButton && <Image src={refreshIcon} width={40} height={40} />}
    </Div>
  )
}
