/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

import { AlbumsByReleaseType_WithIsViewed } from '../../mongoose/Album'
import { _Artist } from '../../mongoose/Artist'
import { Subheader } from '../app-header/Subheader'
import { AlbumCard } from '../cards/album/AlbumCard'
import { AlbumMenu } from '../cards/album/AlbumMenu'
import { CoolCat } from '../shared/CoolCat'

interface Props {
  artist: _Artist
  albumsByReleaseType: AlbumsByReleaseType_WithIsViewed
}

const styles = {
  header: css`
    text-align: left;
    padding: 0 20px;

    h2 {
      margin: 0;
      color: #ebebeb;
      font-size: 72px;
    }
  `,
  albumContainer: (isAlbumNewlyViewed: boolean) => {
    return css`
      display: inline-block;
      position: relative;
      opacity: ${isAlbumNewlyViewed ? '30%' : 'initial'};
      filter: grayscale(${isAlbumNewlyViewed ? 1 : 0});
    `
  },
  menu: css`
    position: absolute;
    top: 5px;
    left: 5px;
    margin: 10px 20px;
    width: 290px;
    height: 290px;
    background-color: white;
  `,
}

export const AlbumsForArtistPage = ({ artist, albumsByReleaseType }: Props) => {
  const [albumMenus, setAlbumMenus] = useState<Record<string, boolean>>({})
  const [newlyViewedAlbums, setNewlyViewedAlbums] = useState<Record<string, boolean>>({})

  if (!albumsByReleaseType) {
    return null
  }

  const animations = 'animate__animated animate__fadeInUp animate__faster'

  const toggleAlbumMenu = (albumId: string) => {
    let timeout = 0

    // Disable the menu if the album was marked as viewed, because it's already been saved to DB
    if (newlyViewedAlbums[albumId]) {
      return
    }

    // Cheap way to animate the menu exiting w/o having to mix Animate.css with CSSTransition
    if (albumMenus[albumId]) {
      const el = document.querySelector(`[data-id="${albumId}"]`)
      el?.classList.add('animate__fadeOutDown')
      timeout = 500
    }

    setTimeout(
      () =>
        setAlbumMenus((prevState) => ({
          ...prevState,
          [albumId]: !prevState[albumId],
        })),
      timeout
    )
  }

  const handleShadeViewedAlbum = (albumId: string) => {
    setNewlyViewedAlbums((prevState) => ({
      ...prevState,
      [albumId]: true,
    }))
  }

  return (
    <div>
      {albumsByReleaseType.album.length === 0 && albumsByReleaseType.single.length === 0 && (
        <CoolCat header='No new albums. Nothing to see here.' subheader='' />
      )}

      {albumsByReleaseType.album.some((album) => !album.isViewed) && <Subheader name='albums' />}

      {albumsByReleaseType.album.map(
        (album) =>
          !album.isViewed && (
            <div key={album.id} css={styles.albumContainer(newlyViewedAlbums[album.id])}>
              <AlbumCard album={album} onClick={() => toggleAlbumMenu(album.id)} />
              {albumMenus[album.id] && (
                <AlbumMenu
                  css={styles.menu}
                  className={animations}
                  album={album}
                  artist={artist}
                  onToggleMenuVisibility={() => toggleAlbumMenu(album.id)}
                  onShadeViewedAlbum={handleShadeViewedAlbum}
                />
              )}
            </div>
          )
      )}

      {albumsByReleaseType.single.some((single) => !single.isViewed) && (
        <Subheader name='singles' />
      )}

      {albumsByReleaseType.single.map(
        (single) =>
          !single.isViewed && (
            <div key={single.id} css={styles.albumContainer(newlyViewedAlbums[single.id])}>
              <AlbumCard album={single} onClick={() => toggleAlbumMenu(single.id)} />
              {albumMenus[single.id] && (
                <AlbumMenu
                  css={styles.menu}
                  className={animations}
                  album={single}
                  artist={artist}
                  onToggleMenuVisibility={() => toggleAlbumMenu(single.id)}
                  onShadeViewedAlbum={handleShadeViewedAlbum}
                />
              )}
            </div>
          )
      )}
    </div>
  )
}
