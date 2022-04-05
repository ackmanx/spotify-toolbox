/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { Subheader } from '../app-header/Subheader'
import { GenreCard } from '../cards/genre/GenreCard'
import { CoolCat } from '../shared/CoolCat'
import { apiFetch } from '../shared/apiFetch'

const styles = {
  root: css`
    text-align: center;
    display: flex;
    justify-content: center;
  `,
  genreContainer: css`
    max-width: 1600px;
    width: 100%;
  `,
}

export const RootPage = () => {
  const { status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [genres, setGenres] = useState<Record<string, string[]>>({})

  useEffect(() => {
    async function doStuff() {
      const result = await apiFetch('/genres/all')

      setGenres(result)
      setIsLoading(false)
    }

    doStuff()
  }, [])

  if (status === 'unauthenticated' || isLoading) {
    return null
  }

  const genreEntries = Object.entries(genres)

  return (
    <div css={styles.root}>
      <div css={styles.genreContainer}>
        {genreEntries.length !== 0 ? (
          genreEntries.map(([genreName, coverArts]) => (
            <GenreCard key={genreName} genreName={genreName} coverArts={coverArts} />
          ))
        ) : (
          <CoolCat
            header="It looks like you've got no followed artists."
            subheader='Level up and try again.'
          />
        )}
      </div>
    </div>
  )
}
