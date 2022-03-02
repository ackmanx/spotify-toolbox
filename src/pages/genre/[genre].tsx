/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import { AppHeader } from '../../components/header/AppHeader'
import { GenrePage } from '../../components/pages/GenrePage'
import { useAccessTokenTimer } from '../../hooks/useAccessTokenTimer'

interface Props {
  genre: string
}

const GenreNextPage: NextPage<Props> = ({ genre }) => {
  useAccessTokenTimer()

  if (!genre) return null

  return (
    <>
      <Head>
        <title>Toolbox - {genre}</title>
      </Head>
      <ToastContainer />
      <GenrePage genre={genre} />
    </>
  )
}

export default GenreNextPage

interface ServerSideProps {
  props: Props
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
}): Promise<ServerSideProps> => {
  const genre = Array.isArray(query.genre) ? query.genre[0] : query.genre ?? ''

  return {
    props: {
      genre,
    },
  }
}
