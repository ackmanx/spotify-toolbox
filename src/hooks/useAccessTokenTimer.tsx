import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

export const useAccessTokenTimer = () => {
  const { data } = useSession()
  const router = useRouter()
  const expiresAt = (data?.expiresAt ?? 0) as number

  useEffect(() => {
    if (expiresAt) {
      const expirationTimeInMs = expiresAt * 1000 - new Date().getTime()

      setTimeout(() => {
        toast.error(
          <>
            <p>Access token has expired</p>
            <p>Sign in again to get a new one</p>
          </>,
          {
            position: 'top-center',
            autoClose: false,
            hideProgressBar: true,
            theme: 'colored',
            onClick: () => router.push('/api/auth/signin'),
          }
        )
      }, expirationTimeInMs)
    }
  }, [expiresAt, router])
}