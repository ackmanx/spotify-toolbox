/** @jsxImportSource @emotion/react */
import { AlbumsByReleaseType_WithIsViewed } from '../../../mongoose/Album'
import { _Artist } from '../../../mongoose/Artist'
import { ReleaseTypeListing } from './ReleaseTypeListing'

interface Props {
  artist: _Artist
  albumsByReleaseType: AlbumsByReleaseType_WithIsViewed
}

export const AlbumsByReleaseType = ({ artist, albumsByReleaseType }: Props) => {
  return (
    <div>
      <ReleaseTypeListing artist={artist} albums={albumsByReleaseType.album} name='albums' />
      <ReleaseTypeListing artist={artist} albums={albumsByReleaseType.single} name='singles' />
    </div>
  )
}
