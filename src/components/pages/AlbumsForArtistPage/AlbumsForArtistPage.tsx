/** @jsxImportSource @emotion/react */
import { AlbumsByReleaseType_WithIsViewed } from '../../../mongoose/Album'
import { _Artist } from '../../../mongoose/Artist'
import { CoolCat } from '../../shared/CoolCat'
import { AlbumsByReleaseType } from './AlbumsByReleaseType'

interface Props {
  artist: _Artist
  albumsByReleaseType: AlbumsByReleaseType_WithIsViewed
}

const styles = {}

export const AlbumsForArtistPage = ({ artist, albumsByReleaseType }: Props) => {
  if (!albumsByReleaseType) {
    return null
  }

  const hasNoUnviewedAlbums =
    !albumsByReleaseType.album.length && !albumsByReleaseType.single.length

  return (
    <div>
      {hasNoUnviewedAlbums && <CoolCat header='No new albums. Nothing to see here.' />}

      <AlbumsByReleaseType artist={artist} albumsByReleaseType={albumsByReleaseType} />
    </div>
  )
}
