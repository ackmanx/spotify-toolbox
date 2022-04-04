/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'

import { AppHeader } from '../../../components/app-header/AppHeader'
import { ArtistPage } from '../../../components/pages/ArtistPage'
import { apiFetch } from '../../../components/shared/apiFetch'
import { useAccessTokenTimer } from '../../../hooks/useAccessTokenTimer'
import dbConnect from '../../../lib/db'
import {
  AlbumsByReleaseType,
  AlbumsByReleaseType_WithIsViewed,
  _Album,
} from '../../../mongoose/Album'
import { _Artist, mArtist } from '../../../mongoose/Artist'
import { One } from '../../../mongoose/types'
import { forceSerialization } from '../../../utils/force-serialization'

interface Props {
  artist: _Artist
}

type AlbumByReleaseTypeTuple = [string, (_Album & { isViewed: boolean })[]]

const ArtistNextPage: NextPage<Props> = ({ artist }) => {
  const [albumsByReleaseType, setAlbumsByReleaseType] = useState<AlbumsByReleaseType_WithIsViewed>()
  const artistId = artist.id

  useAccessTokenTimer()

  useEffect(() => {
    async function doStuff() {
      const body = await apiFetch(`/artist/${artistId}`)
      setAlbumsByReleaseType(body)
    }

    doStuff()
  }, [artistId])

  if (!artist || !albumsByReleaseType) return null

  const albumIDs = Object.entries(albumsByReleaseType)
    .map(([releaseType, albums]: AlbumByReleaseTypeTuple) => albums.map((album) => album.id))
    .flat()

  return (
    <>
      <Head>
        <title>{artist.name}</title>
      </Head>
      <AppHeader
        title={artist.name}
        artists={[artist]}
        albumIDs={albumIDs}
        isRefreshable
        isArtistPage
      />
      <main
        css={css`
          text-align: center;
        `}
      >
        <ToastContainer />

        <ArtistPage artist={artist} albumsByReleaseType={albumsByReleaseType} />
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
