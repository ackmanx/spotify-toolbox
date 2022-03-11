/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import { AppHeader } from '../../components/header/AppHeader'
import { ArtistPage } from '../../components/pages/ArtistPage'
import { useAccessTokenTimer } from '../../hooks/useAccessTokenTimer'
import dbConnect from '../../lib/db'
import { _Artist, mArtist } from '../../mongoose/Artist'
import { One } from '../../mongoose/types'
import { forceSerialization } from '../../utils/force-serialization'

interface Props {
  artist: _Artist
}

const ArtistNextPage: NextPage<Props> = ({ artist }) => {
  useAccessTokenTimer()

  if (!artist) return null

  return (
    <>
      <Head>
        <title>Toolbox - {artist.name}</title>
      </Head>
      <AppHeader title={artist.name} artists={[artist]} isRefreshable />
      <main
        css={css`
          text-align: center;
        `}
      >
        <ToastContainer />

        <ArtistPage artist={artist} />
      </main>
    </>
  )
}

export default ArtistNextPage

interface ServerSideProps {
  props: Props
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}): Promise<ServerSideProps> => {
  await dbConnect()

  const artistInDB: One<_Artist> = await mArtist.findOne({ id: query.artistId })

  if (!artistInDB) {
    throw new Error(`No artist found for ${query.artistId}`)
  }

  return {
    props: forceSerialization<Props>({ artist: artistInDB }),
  }
}
