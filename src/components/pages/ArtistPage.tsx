/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

import { _Artist } from '../../mongoose/Artist'
import { AlbumsByReleaseType } from '../../pages/artist/[artistId]'
import { AlbumMenu } from '../card/AlbumMenu'
import { Card } from '../card/Card'

interface Props {
  artist: _Artist
  albumsByReleaseType: AlbumsByReleaseType
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

export const ArtistPage = ({ artist, albumsByReleaseType }: Props) => {
  const [albumMenus, setAlbumMenus] = useState<Record<string, boolean>>({})
  const [newlyViewedAlbums, setNewlyViewedAlbums] = useState<Record<string, boolean>>({})

  const albums = albumsByReleaseType.album
  const singles = albumsByReleaseType.single

  const animations = 'animate__animated animate__fadeInUp animate__faster'

  const toggleAlbumMenu = (albumId: string) => {
    let timeout = 0

    // Disable the menu if the album was marked as viewed, because it's already been saved to DB
    if (newlyViewedAlbums[albumId]) {
      return
    }

    // Cheap way to animate the menu exiting w/o having to mix Animate.css with CSSTransition
    if (albumMenus[albumId]) {
      const el = document.querySelector(`[data-album-id="${albumId}"]`)
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

  const handleViewedAlbum = (albumId: string) => {
    setNewlyViewedAlbums((prevState) => ({
      ...prevState,
      [albumId]: true,
    }))
  }

  return (
    <div>
      <div css={styles.header}>
        <h2>albums</h2>
      </div>
      {albums.map((album) => (
        <div key={album.id} css={styles.albumContainer(newlyViewedAlbums[album.id])}>
          <Card album={album} onClick={() => toggleAlbumMenu(album.id)} />
          {albumMenus[album.id] && (
            <AlbumMenu
              css={styles.menu}
              className={animations}
              albumId={album.id}
              onClick={() => toggleAlbumMenu(album.id)}
              onViewedAlbum={handleViewedAlbum}
            />
          )}
        </div>
      ))}

      <div css={styles.header}>
        <h2>singles</h2>
      </div>
      {singles.map((single) => (
        <div key={single.id} css={styles.albumContainer(newlyViewedAlbums[single.id])}>
          <Card album={single} onClick={() => toggleAlbumMenu(single.id)} />
          {albumMenus[single.id] && (
            <AlbumMenu
              css={styles.menu}
              className={animations}
              albumId={single.id}
              onClick={() => toggleAlbumMenu(single.id)}
              onViewedAlbum={handleViewedAlbum}
            />
          )}
        </div>
      ))}
    </div>
  )
}
