import { createContext, useState } from 'react'

interface AuthContext {
  isExpired: boolean
  setIsExpired(value: boolean): void
}

export const AuthContext = createContext<AuthContext>({
  isExpired: false,
  setIsExpired: () => {},
})

export const AuthContextProvider = ({ children }: any) => {
  const [isExpired, setIsExpired] = useState(false)
  return <AuthContext.Provider value={{ isExpired, setIsExpired }}>{children}</AuthContext.Provider>
}
