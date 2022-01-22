import Image from 'next/image'
import styled from '@emotion/styled'
import { _Artist } from '../../mongoose/Artist'
import ArtistPlaceholder from './artist-placeholder.png'

interface Props {
  artists: _Artist[]
}

const Div = styled.div`
  display: inline-block;
  width: 300px;
  height: 300px;
  margin: 20px;
`

const DivSpacer = styled.div`
  height: 50px;
`

const H2 = styled.h2`
  padding: 0 20px;
  margin: 0;
  text-align: left;
  color: #ebebeb;
  font-size: 72px;
  position: absolute;
  width: 100%;
`

export const Artists = ({ artists }: Props) => {
  if (!artists.length) {
    return null
  }

  return (
    <>
      <H2>Industrial Metal</H2>
      <DivSpacer />
      {artists.map((artist) => (
        <Div key={artist.artistId}>
          <Image src={artist.coverArt || ArtistPlaceholder} width={300} height={300} />
          <h3>{artist.name}</h3>
        </Div>
      ))}
    </>
  )
}
