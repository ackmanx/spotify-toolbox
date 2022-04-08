/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'

import { AlbumsByReleaseType_WithIsViewed, _Album } from '../../../mongoose/Album'
import { _Artist } from '../../../mongoose/Artist'
import { AppHeader } from '../../app-header/AppHeader'
import { CoolCat } from '../../shared/CoolCat'
import { apiFetch } from '../../shared/apiFetch'
import { AlbumsByReleaseType } from './AlbumsByReleaseType'

interface Props {
  artist: _Artist
}

type AlbumByReleaseTypeTuple = [string, (_Album & { isViewed: boolean })[]]

const styles = {}

export const AlbumsForArtistPage = ({ artist }: Props) => {
  const [albumsByReleaseType, setAlbumsByReleaseType] = useState<AlbumsByReleaseType_WithIsViewed>()
  const artistId = artist.id

  useEffect(() => {
    async function doStuff() {
      const body = await apiFetch(`/artist/${artistId}`)
      setAlbumsByReleaseType(body)
    }

    doStuff()
  }, [artistId])

  if (!albumsByReleaseType) {
    return null
  }

  const albumIDs = Object.entries(albumsByReleaseType)
    .map(([releaseType, albums]: AlbumByReleaseTypeTuple) => albums.map((album) => album.id))
    .flat()

  const hasNoUnviewedAlbums =
    !albumsByReleaseType.album.length && !albumsByReleaseType.single.length

  return (
    <div>
      {hasNoUnviewedAlbums && <CoolCat header='No new albums. Nothing to see here.' />}

      <AppHeader
        title={artist.name}
        artists={[artist]}
        albumIDs={albumIDs}
        isRefreshable
        isArtistPage
      />
      <main
        css={css`
          text-align: center;
        `}
      >
        <AlbumsByReleaseType artist={artist} albumsByReleaseType={albumsByReleaseType} />
      </main>
    </div>
  )
}
