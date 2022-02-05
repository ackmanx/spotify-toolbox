import 'animate.css'
import 'react-toastify/dist/ReactToastify.css'
import '../../public/globals.css'
import '../../public/animations.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
