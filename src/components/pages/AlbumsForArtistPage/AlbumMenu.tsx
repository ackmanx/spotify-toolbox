/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { CSSTransition } from 'react-transition-group'

import { _Album } from '../../../mongoose/Album'
import { _Artist } from '../../../mongoose/Artist'
import { ButtonImage, ImageLink } from '../../shared/Image'
import AddToPlaylistIcon from './images/add-to-playlist.png'
import MarkAsViewedIcon from './images/mark-album-as-viewed.png'
import OpenSpotifyIcon from './images/open-in-spotify.png'
import OpenWebIcon from './images/open-in-web.png'

interface Props {
  album: _Album
  artist: _Artist
  className?: string //css prop
  onToggleMenuVisibility(): void
  onShadeViewedAlbum(albumId: string): void
}

const styles = {
  root: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;

    & * {
      cursor: pointer;
    }
  `,
  icon: css`
    transform: scale(100%);
    transition: transform 0.1s linear;

    &:hover {
      transform: scale(110%);
      transition: transform 0.1s linear;
    }
  `,
}

export const AlbumMenu = ({
  album,
  artist,
  className,
  onToggleMenuVisibility,
  onShadeViewedAlbum,
}: Props) => {
  const ref = useRef(null)
  const [markViewedProcessing, setMarkViewedProcessing] = useState(false)

  const handleMarkAsViewed = async (event: any) => {
    event.stopPropagation() //todo majerus: do i need this
    setMarkViewedProcessing(true)

    await fetch(`/api/user/mark-album-as-viewed/${artist.id}/${album.id}`)

    onToggleMenuVisibility()
    onShadeViewedAlbum(album.id)
  }

  const handleAddToPlaylist = async (event: any) => {
    event.stopPropagation() //todo majerus: do i need this
    setMarkViewedProcessing(true)

    const addToPlaylistResponse = await fetch(`/api/playlist/add-album/${album.id}`)
    const body = await addToPlaylistResponse.json()

    if (!addToPlaylistResponse.ok) {
      toast.error(body.message, { position: 'top-center', autoClose: false })
      return
    }

    await fetch(`/api/user/mark-album-as-viewed/${artist.id}/${album.id}`)
    onToggleMenuVisibility()
    onShadeViewedAlbum(album.id)
  }

  return (
    <div
      css={styles.root}
      className={className}
      data-id={album.id}
      onClick={onToggleMenuVisibility}
    >
      <CSSTransition
        nodeRef={ref}
        classNames='mark_viewed'
        in={markViewedProcessing}
        timeout={99999}
      >
        <div ref={ref} css={styles.icon}>
          <ButtonImage src={MarkAsViewedIcon} width={50} height={50} onClick={handleMarkAsViewed} />
          Mark as Viewed
        </div>
      </CSSTransition>
      <div ref={ref} css={styles.icon}>
        <ImageLink href={album.spotifyUri} imageSrc={OpenSpotifyIcon} width={35} height={35} />
        Open in Spotify
      </div>
      <div ref={ref} css={styles.icon}>
        <ImageLink href={album.spotifyWebUrl} imageSrc={OpenWebIcon} width={35} height={35} />
        Open in Web
      </div>
      <CSSTransition
        nodeRef={ref}
        classNames='mark_viewed'
        in={markViewedProcessing}
        timeout={99999}
      >
        <div ref={ref} css={styles.icon}>
          <ButtonImage
            src={AddToPlaylistIcon}
            width={35}
            height={35}
            onClick={handleAddToPlaylist}
          />
          Add to Playlist
        </div>
      </CSSTransition>
    </div>
  )
}
