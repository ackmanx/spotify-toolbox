/** @jsxImportSource @emotion/react */
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { CSSTransition } from 'react-transition-group'

import MarkAsViewedIcon from '../cards/album/images/mark-album-as-viewed.png'
import { ButtonImage } from '../shared/Image'

interface Props {
  albumIDs: string[]
  artistID: string
}

export const BulkMarkAsViewedButton = ({ artistID, albumIDs }: Props) => {
  const [isAdding, setIsAdding] = useState(false)
  const [numAlbumAdding, setNumAlbumAdding] = useState(0)
  const refreshRef = useRef(null)

  const handleBulkMarkAsViewed = async (event: any) => {
    setIsAdding(true)

    try {
      for (let i = 0; i < albumIDs.length; i++) {
        setNumAlbumAdding(i + 1)

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
            src={MarkAsViewedIcon}
            width={20}
            height={20}
            onClick={handleBulkMarkAsViewed}
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
