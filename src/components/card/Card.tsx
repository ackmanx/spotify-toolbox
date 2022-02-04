import NextImage from 'next/image'
import AlbumPlaceholder from './album-placeholder.png'
import { AlbumWithViewed } from '../../pages/artist/[artistId]'
import styled from '@emotion/styled'

interface Props {
  album: AlbumWithViewed
}

const DivRoot = styled.div`
  display: inline-block;
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

export const Card = ({ album }: Props) => {
  if (album.isViewed) {
    return null
  }

  return (
    <DivRoot key={album.id}>
      <NextImage src={album.coverArt || AlbumPlaceholder} width={300} height={300} />
      <H3>{album.name}</H3>
      <p>{album.releaseDate}</p>
    </DivRoot>
  )
}
