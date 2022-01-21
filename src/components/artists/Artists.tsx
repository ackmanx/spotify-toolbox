import Image from 'next/image'
import styled from '@emotion/styled'
import { _Artist } from '../../mongoose/Artist'
import ArtistPlaceholder from './artist-placeholder.png'

interface Props {
  artists: _Artist[]
}

const Container$ = styled.div`
  display: inline-block;
  width: 300px;
  height: 300px;
  margin: 20px;
`

export const Artists = ({ artists }: Props) => {
  if (!artists.length) {
    return null
  }

  return (
    <>
      {artists.map((artist) => (
        <Container$ key={artist.artistId}>
          <Image src={artist.coverArt || ArtistPlaceholder} width={300} height={300} />
          <h3>{artist.name}</h3>
        </Container$>
      ))}
    </>
  )
}
