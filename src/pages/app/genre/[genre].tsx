/** @jsxImportSource @emotion/react */
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import { ArtistsInGenrePage } from '../../../components/pages/ArtistsInGenrePage/ArtistsInGenrePage'
import { useAccessTokenTimer } from '../../../hooks/useAccessTokenTimer'

interface Props {
  genre: string
}

const GenreNextPage: NextPage<Props> = ({ genre }) => {
  useAccessTokenTimer()

  if (!genre) return null

  return (
    <>
      <Head>
        <title>{genre}</title>
      </Head>
      <ToastContainer />
      <ArtistsInGenrePage genre={genre} />
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
