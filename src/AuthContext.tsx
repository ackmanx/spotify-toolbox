import { useSession } from 'next-auth/react'
import { createContext, useState } from 'react'

interface AuthContext {
  isTokenExpired: boolean
  setIsTokenExpired(value: boolean): void
}

export const AuthContext = createContext<AuthContext>({
  isTokenExpired: false,
  setIsTokenExpired: () => {},
})

export const AuthContextProvider = ({ children }: any) => {
  const { data } = useSession()

  const tokenExpiresAtMs = (data?.expiresAt as number) * 1000
  const [isTokenExpired, setIsTokenExpired] = useState(tokenExpiresAtMs - new Date().getTime() < 0)

  return (
    <AuthContext.Provider value={{ isTokenExpired, setIsTokenExpired }}>
      {children}
    </AuthContext.Provider>
  )
}
