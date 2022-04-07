/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { AppHeader } from '../../app-header/AppHeader'
import { CoolCat } from '../../shared/CoolCat'
import { apiFetch } from '../../shared/apiFetch'
import { GenreCard } from './GenreCard'

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

export const GenreListPage = () => {
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

  if (isLoading) {
    return null
  }

  const genreEntries = Object.entries(genres).sort(([genreA], [genreB]) =>
    genreA > genreB ? 1 : -1
  )

  return (
    <div>
      <AppHeader title='I Already Saw That' />
      <main>
        {status === 'unauthenticated' ? (
          <CoolCat header='It looks like you are not signed in.' subheader='Try harder.' />
        ) : (
          <div css={styles.root}>
            <div css={styles.genreContainer}>
              {genreEntries.length > 0 ? (
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
        )}
      </main>
    </div>
  )
}
