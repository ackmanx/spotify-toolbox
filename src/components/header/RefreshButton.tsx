/** @jsxImportSource @emotion/react */
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { CSSTransition } from 'react-transition-group'

import { ButtonImage } from '../shared/Image'
import RefreshIcon from './images/refresh-icon.png'

interface Props {
  artistIDs: string[]
}

export const RefreshButton = ({ artistIDs }: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const refreshRef = useRef(null)

  const handleRefresh = async (event: any) => {
    setIsRefreshing(true)

    try {
      for (let i = 0; artistIDs.length < i; i++) {
        const response = await fetch(`/api/artist/refresh/${artistIDs[i]}`)

        if (!response.ok) {
          const error = await response.json()
          toast.error(error.message, { position: 'top-center', autoClose: false })
          return
        }
      }
    } catch (error: any) {
      setIsRefreshing(false)
      return toast.error(error.message, { position: 'top-center', autoClose: false })
    } finally {
      window.location.reload()
    }
  }

  return (
    <>
      <CSSTransition
        nodeRef={refreshRef}
        classNames='refresh_icon'
        in={isRefreshing}
        timeout={99999}
      >
        <div ref={refreshRef}>
          <ButtonImage
            src={RefreshIcon}
            width={20}
            height={20}
            onClick={handleRefresh}
            disabled={isRefreshing}
          />
        </div>
      </CSSTransition>
    </>
  )
}
