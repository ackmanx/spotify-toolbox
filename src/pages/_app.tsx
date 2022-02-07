import 'animate.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css'

import '../../public/animations.css'
import '../../public/globals.css'
import { AuthContextProvider } from '../AuthContext'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </SessionProvider>
  )
}

export default MyApp
