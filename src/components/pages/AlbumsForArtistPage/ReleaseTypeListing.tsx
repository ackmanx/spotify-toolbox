/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

import { _Album } from '../../../mongoose/Album'
import { _Artist } from '../../../mongoose/Artist'
import { Subheader } from '../../app-header/Subheader'
import { AlbumCard } from './AlbumCard'
import { AlbumMenu } from './AlbumMenu'

interface Props {
  artist: _Artist
  albums: (_Album & { isViewed: boolean })[]
  name: string
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

export const ReleaseTypeListing = ({ artist, albums, name }: Props) => {
  const albumContextMenuAnimations = 'animate__animated animate__fadeInUp animate__faster'
  const [albumMenus, setAlbumMenus] = useState<Record<string, boolean>>({})
  const [newlyViewedAlbums, setNewlyViewedAlbums] = useState<Record<string, boolean>>({})

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
      {albums.some((album) => !album.isViewed) && <Subheader name={name} />}

      {albums.map(
        (album) =>
          !album.isViewed && (
            <div key={album.id} css={styles.albumContainer(newlyViewedAlbums[album.id])}>
              {/* todo majerus: I think that the album menu should be managed by the card and then we won't need to keep track */}
              <AlbumCard album={album} onClick={() => toggleAlbumMenu(album.id)} />
              {albumMenus[album.id] && (
                <AlbumMenu
                  css={styles.menu}
                  className={albumContextMenuAnimations}
                  album={album}
                  artist={artist}
                  onToggleMenuVisibility={() => toggleAlbumMenu(album.id)}
                  onShadeViewedAlbum={handleShadeViewedAlbum}
                />
              )}
            </div>
          )
      )}
    </div>
  )
}
