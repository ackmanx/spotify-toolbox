/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { AppHeader } from '../../app-header/AppHeader'
import { CoolCat } from '../../shared/CoolCat'
import { apiFetch } from '../../shared/apiFetch'
import { GenreCard } from './GenreCard'

const styles = {
  centerAppBody: css`
    text-align: center;
  `,
  root: css`
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
  const [genres, setGenres] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  console.log(777, status)

  useEffect(() => {
    async function doStuff() {
      if (status === 'unauthenticated') return

      const result = await apiFetch('/genres/all')

      const sorted = Object.entries(result).sort(([genreA], [genreB]) => (genreA > genreB ? 1 : -1))

      setGenres(sorted)
      setIsLoading(false)
    }

    doStuff()
  }, [status])

  return (
    <div>
      <AppHeader title='I Already Saw That' />
      <main css={styles.centerAppBody}>
        {status === 'unauthenticated' ? (
          <CoolCat header='It looks like you are not signed in.' subheader='Try harder.' />
        ) : (
          <div css={styles.root}>
            <div css={styles.genreContainer}>
              {isLoading ? null : genres.length > 0 ? (
                genres.map(([genreName, coverArts]) => (
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
