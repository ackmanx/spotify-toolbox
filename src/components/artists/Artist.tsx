import styled from '@emotion/styled'
import { _Artist } from '../../mongoose/Artist'
import ArtistPlaceholder from './artist-placeholder.png'
import { ImageLink } from '../shared/Image'

interface Props {
  artist: _Artist
}

const DivRoot = styled.div`
  display: inline-block;
  width: 300px;
  height: 300px;
  margin: 20px;
`

const DivImageContainer = styled.div`
  transform: scale(100%);
  transition: transform 200ms;
  cursor: pointer;

  &:hover {
    transform: scale(108%);
    transition: transform 200ms;
  }
`

export const Artist = ({ artist }: Props) => {
  return (
    <DivRoot>
      <DivImageContainer>
        <ImageLink
          href={`/artist/${artist.id}`}
          imageSrc={artist.coverArt || ArtistPlaceholder}
          width={300}
          height={300}
        />
      </DivImageContainer>
      <h3>{artist.name}</h3>
    </DivRoot>
  )
}
