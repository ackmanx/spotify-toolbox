/** @jsxImportSource @emotion/react */
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import { AlbumsForArtistPage } from '../../../components/pages/AlbumsForArtistPage/AlbumsForArtistPage'
import { useAccessTokenTimer } from '../../../hooks/useAccessTokenTimer'
import dbConnect from '../../../lib/db'
import { _Artist, mArtist } from '../../../mongoose/Artist'
import { One } from '../../../mongoose/types'
import { forceSerialization } from '../../../utils/force-serialization'

interface Props {
  artist: _Artist
}

const ArtistNextPage: NextPage<Props> = ({ artist }) => {
  useAccessTokenTimer()

  return (
    <>
      <Head>
        <title>{artist.name}</title>
      </Head>
      <ToastContainer />
      <AlbumsForArtistPage artist={artist} />
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
