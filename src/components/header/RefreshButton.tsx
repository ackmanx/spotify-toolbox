/** @jsxImportSource @emotion/react */
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { CSSTransition } from 'react-transition-group'

import { ButtonImage } from '../shared/Image'
import RefreshIcon from './images/refresh-icon.png'

interface Props {
  name: string
}

const styles = {
  // button: css`
  //   position: relative;
  //   top: 10px;
  // `,
}

export const RefreshButton = ({ name }: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const refreshRef = useRef(null)

  const handleRefresh = async (event: any) => {
    setIsRefreshing(true)

    try {
      const response = await fetch(`/api/refresh/${name}`)

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message, { position: 'top-center', autoClose: false })
        return
      }

      window.location.reload()
    } catch (error: any) {
      toast.error(error.message, { position: 'top-center', autoClose: false })
    } finally {
      setIsRefreshing(false)
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
