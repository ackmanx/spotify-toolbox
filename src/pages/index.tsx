/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import Header from '../components/header/Header'
import { RootPage } from '../components/pages/RootPage'
import { CoolCat } from '../components/shared/CoolCat'
import { useAccessTokenTimer } from '../hooks/useAccessTokenTimer'

const RootNextPage: NextPage = () => {
  useAccessTokenTimer()
  const { status } = useSession()

  return (
    <>
      <Head>
        <title>Toolbox</title>
      </Head>
      <ToastContainer />
      <Header />
      <main
        css={css`
          text-align: center;
        `}
      >
        {status === 'unauthenticated' && (
          <CoolCat header='It looks like you are not signed in.' subheader='Try harder.' />
        )}
        <RootPage />
      </main>
    </>
  )
}

export default RootNextPage

// export const getServerSideProps: GetServerSideProps = async ({ req }): Promise<ServerSideProps> => {
//   const sFollowedArtists = await GetAll.followedArtists(session?.accessToken as string)
//   const followedArtistsIDs: string[] = sFollowedArtists.map((artist) => artist.id)
//
//   const followedArtistsInDB_IDs = mFollowedArtistsInDB.map((artist) => artist.id)
//
//   const sNewArtistsToSaveToDB = sFollowedArtists.filter(
//     (artist) => !followedArtistsInDB_IDs.includes(artist.id)
//   )
//
//   const mNewArtistsToSaveToDB = sNewArtistsToSaveToDB.map((artist) => buildArtist(artist))
//   await mArtist.bulkSave(mNewArtistsToSaveToDB)
//
//   const mArtists: Many<_Artist> = mFollowedArtistsInDB.concat(mNewArtistsToSaveToDB)
//
//   const artistsByGenre = mArtists.reduce((genres: Record<string, Many<_Artist>>, artist) => {
//     if (!genres[artist.genre]) genres[artist.genre] = []
//
//     genres[artist.genre].push(artist)
//
//     return genres
//   }, {})
//
//   user.followedArtists = followedArtistsIDs
//   await user.save()
//
//   return {
//     props: forceSerialization<Props>({
//       artistsByGenre,
//       viewedAlbums: user.viewedAlbums,
//       isTokenExpired,
//     }),
//   }
// }
