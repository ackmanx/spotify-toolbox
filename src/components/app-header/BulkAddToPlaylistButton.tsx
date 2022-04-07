/** @jsxImportSource @emotion/react */
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { CSSTransition } from 'react-transition-group'

import AddToPlaylistIcon from '../pages/AlbumsForArtistPage/images/add-to-playlist.png'
import { ButtonImage } from '../shared/Image'

interface Props {
  albumIDs: string[]
  artistID: string
}

export const BulkAddToPlaylistButton = ({ artistID, albumIDs }: Props) => {
  const [isAdding, setIsAdding] = useState(false)
  const [numAlbumAdding, setNumAlbumAdding] = useState(0)
  const refreshRef = useRef(null)

  const handleBulkAdd = async (event: any) => {
    setIsAdding(true)

    try {
      for (let i = 0; i < albumIDs.length; i++) {
        setNumAlbumAdding(i + 1)

        const addToPlaylistResponse = await fetch(`/api/playlist/add-album/${albumIDs[i]}`)

        if (!addToPlaylistResponse.ok) {
          const error = await addToPlaylistResponse.json()
          toast.error(error.message, { position: 'top-center', autoClose: false })
          return
        }

        const markAsViewedResponse = await fetch(
          `/api/user/mark-album-as-viewed/${artistID}/${albumIDs[i]}`
        )

        if (!markAsViewedResponse.ok) {
          const error = await markAsViewedResponse.json()
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
