/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'

import { _Artist } from '../../mongoose/Artist'
import { AlbumsByReleaseType } from '../../pages/artist/[artistId]'
import { AlbumMenu } from '../card/AlbumMenu'
import { Card } from '../card/Card'

interface Props {
  artist: _Artist
  albums: AlbumsByReleaseType
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
  albumContainer: css`
    display: inline-block;
    position: relative;
  `,
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

export const ArtistPage = ({ artist, albums }: Props) => {
  const [albumMenus, setAlbumMenus] = useState<Record<string, boolean>>({})

  const animations = 'animate__animated animate__fadeInUp animate__faster'

  const showAlbumMenu = (albumId: string) => {
    let timeout = 0

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

  return (
    <div>
      <div css={styles.header}>
        <h2>albums</h2>
      </div>
      {albums.album.map((album) => (
        <div key={album.id} css={styles.albumContainer}>
          <Card album={album} onClick={() => showAlbumMenu(album.id)} />
          {albumMenus[album.id] && (
            <AlbumMenu
              css={styles.menu}
              className={animations}
              albumId={album.id}
              onClick={() => showAlbumMenu(album.id)}
            />
          )}
        </div>
      ))}

      <div css={styles.header}>
        <h2>singles</h2>
      </div>
      {albums.single.map((single) => (
        <div key={single.id} css={styles.albumContainer}>
          <Card album={single} onClick={() => showAlbumMenu(single.id)} />
          {albumMenus[single.id] && (
            <AlbumMenu
              css={styles.menu}
              className={animations}
              albumId={single.id}
              onClick={() => showAlbumMenu(single.id)}
            />
          )}
        </div>
      ))}
    </div>
  )
}
