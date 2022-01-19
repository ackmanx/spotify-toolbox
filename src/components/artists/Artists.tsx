import { useSession } from 'next-auth/react'
import Image from 'next/image'
import styled from '@emotion/styled'
import { ArtistsInterface } from '../../pages'
import ArtistPlaceholder from './artist-placeholder.png'

interface Props {
  artists: ArtistsInterface[]
}

const Container$ = styled.div`
  display: inline-block;
  width: 300px;
  height: 300px;
  margin: 20px;
`

export const Artists = ({ artists }: Props) => {
  const { data: session } = useSession()

  if (!artists.length) {
    return null
  }

  return artists.map((artist) => (
    <Container$>
      <Image src={artist.coverArt ?? ArtistPlaceholder} width={300} height={300} />
      <h3>{artist.name}</h3>
    </Container$>
  ))
}
