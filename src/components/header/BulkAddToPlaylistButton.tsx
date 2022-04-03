/** @jsxImportSource @emotion/react */
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { CSSTransition } from 'react-transition-group'

import AddToPlaylistIcon from '../album/images/add-to-playlist.png'
import { ButtonImage } from '../shared/Image'
import RefreshIcon from './images/refresh-icon.png'

interface Props {
  albumIDs: string[]
}

export const BulkAddToPlaylistButton = ({ albumIDs }: Props) => {
  const [isAdding, setIsAdding] = useState(false)
  const [numAlbumAdding, setNumAlbumAdding] = useState(0)
  const refreshRef = useRef(null)

  const handleBulkAdd = async (event: any) => {
    setIsAdding(true)

    try {
      for (let i = 0; i < albumIDs.length; i++) {
        setNumAlbumAdding(i + 1)
        const followedArtistsResponse = await fetch(`/api/user/followed-artists`)

        if (!followedArtistsResponse.ok) {
          const error = await followedArtistsResponse.json()
          toast.error(error.message, { position: 'top-center', autoClose: false })
          return
        }

        const addToPlaylistResponse = await fetch(`/api/playlist/add-album/${albumIDs[i]}`)

        if (!addToPlaylistResponse.ok) {
          const error = await addToPlaylistResponse.json()
          toast.error(error.message, { position: 'top-center', autoClose: false })
          return
        }
      }

      window.location.reload()
    } catch (error: any) {
      setIsAdding(false)
      return toast.error(error.message, { position: 'top-center', autoClose: false })
    }
  }

  return (
    <>
      <CSSTransition nodeRef={refreshRef} classNames='refresh_icon' in={isAdding} timeout={99999}>
        <div ref={refreshRef}>
          <ButtonImage
            src={AddToPlaylistIcon}
            width={20}
            height={20}
            onClick={handleBulkAdd}
            disabled={isAdding}
          />
          {isAdding && albumIDs.length > 1 && (
            <>
              {numAlbumAdding}/{albumIDs.length}
            </>
          )}
        </div>
      </CSSTransition>
    </>
  )
}
