import NextImage from 'next/image'
import AlbumPlaceholder from './album-placeholder.png'
import { AlbumWithViewed } from '../../pages/artist/[artistId]'
import styled from '@emotion/styled'

interface Props {
  album: AlbumWithViewed
  onClick(): void
}

const DivRoot = styled.div`
  width: 300px;
  margin: 10px 20px;
  overflow: hidden;
`

const H3 = styled.h3`
  margin: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const Card = ({ album, onClick }: Props) => {
  if (album.isViewed) {
    return null
  }

  return (
    <DivRoot key={album.id}>
      <NextImage
        src={album.coverArt || AlbumPlaceholder}
        width={300}
        height={300}
        onClick={onClick}
      />
      <H3>{album.name}</H3>
      {album.releaseDate}
    </DivRoot>
  )
}
