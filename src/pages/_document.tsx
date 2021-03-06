import { Head, Html, Main, NextScript } from 'next/document'

/*
 * This only runs on server and is run for every page
 */
export default function Document() {
  return (
    <Html>
      <Head>
        <link rel='icon' href='/favicon.png' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
        <link
          href='https://fonts.googleapis.com/css2?family=Zen+Kurenaido&display=swap'
          rel='stylesheet'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
