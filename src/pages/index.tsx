import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { getSession, useSession } from 'next-auth/react'
import Header from '../components/header/Header'
import { useState } from 'react'
import styled from '@emotion/styled'
import { Artist } from '../components/artists/Artist'
import { _Artist, mArtist } from '../mongoose/Artist'
import { Genre } from '../components/genre/Genre'
import { NotLoggedInImage } from '../components/images/NotLoggedInImage'
import dbConnect from '../lib/db'
import { FindOne } from '../mongoose/types'
import { _User, mUser } from '../mongoose/User'
import { forceSerialization } from '../utils/force-serialization'
import { useAccessTokenTimer } from '../hooks/useAccessTokenTimer'
import { ToastContainer } from 'react-toastify'

interface Props {
  artistsByGenre: Record<string, _Artist[]>
}

const Main = styled.main`
  text-align: center;
`

const RootPage: NextPage<Props> = ({ artistsByGenre }) => {
  useAccessTokenTimer()
  const { status } = useSession()
  const [genres, setGenres] = useState<Record<string, _Artist[]>>(artistsByGenre)
  const [visibleGenres, setVisibleGenres] = useState<Record<string, boolean | undefined>>({})

  const handleGenreHide = (genre: string) =>
    setVisibleGenres((prevState) => ({
      ...prevState,
      [genre]: prevState[genre] == null ? false : !prevState[genre],
    }))

  const handleGenreRefresh = (genre: string, artists: _Artist[]) =>
    setGenres((prevState) => ({
      ...prevState,
      [genre]: artists,
    }))

  const genresSorted = Object.keys(genres).sort()

  return (
    <>
      <Head>
        <title>Toolbox</title>
      </Head>
      <ToastContainer />
      <Header />
      <Main>
        {status === 'unauthenticated' && <NotLoggedInImage />}
        {genresSorted.map((genre) => (
          <div key={genre}>
            <Genre
              name={genre}
              onClick={() => handleGenreHide(genre)}
              onRefresh={handleGenreRefresh}
            />

            {(visibleGenres[genre] || visibleGenres[genre] == null) &&
              genres[genre].map((artist) => <Artist key={artist.id} artist={artist} />)}
          </div>
        ))}
      </Main>
    </>
  )
}

export default RootPage

interface ServerSideProps {
  props: Props
}

export const getServerSideProps: GetServerSideProps = async ({ req }): Promise<ServerSideProps> => {
  const session = await getSession({ req })
  await dbConnect()

  const user: FindOne<_User> = await mUser.findOne({ userId: session?.userId })
  const artists: _Artist[] = await mArtist.find({ id: { $in: user?.followedArtists } })

  const artistsByGenre = artists.reduce((genres: Record<string, _Artist[]>, artist) => {
    if (!genres[artist.genre]) genres[artist.genre] = []

    genres[artist.genre].push(artist)

    return genres
  }, {})

  return {
    props: forceSerialization({ artistsByGenre }),
  }
}
