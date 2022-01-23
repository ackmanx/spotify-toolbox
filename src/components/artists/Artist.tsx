import Image from 'next/image'
import styled from '@emotion/styled'
import { _Artist } from '../../mongoose/Artist'
import ArtistPlaceholder from './artist-placeholder.png'

interface Props {
  artist: _Artist
}

const Div = styled.div`
  display: inline-block;
  width: 300px;
  height: 300px;
  margin: 20px;
`

export const Artist = ({ artist }: Props) => {
  return (
    <>
      <Div>
        <Image src={artist.coverArt || ArtistPlaceholder} width={300} height={300} />
        <h3>{artist.name}</h3>
      </Div>
    </>
  )
}
