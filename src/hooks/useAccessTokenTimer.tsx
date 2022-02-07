import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { toast } from 'react-toastify'

import { AuthContext } from '../AuthContext'

export const useAccessTokenTimer = () => {
  const { data } = useSession()
  const router = useRouter()
  const { setIsExpired } = useContext(AuthContext)
  const expiresAt = (data?.expiresAt ?? 0) as number

  useEffect(() => {
    if (expiresAt) {
      const expirationTimeInMs = expiresAt * 1000 - new Date().getTime()

      setTimeout(() => {
        setIsExpired(true)
      }, expirationTimeInMs)
    }
  }, [expiresAt, router, setIsExpired])
}
