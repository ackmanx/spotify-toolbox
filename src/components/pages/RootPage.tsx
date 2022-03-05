/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { Genre } from '../genre/Genre'
import { Subheader } from '../header/Subheader'
import { CoolCat } from '../shared/CoolCat'

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
  const [genres, setGenres] = useState<string[]>([])

  useEffect(() => {
    async function doStuff() {
      const res = await fetch('/api/genres/all')
      const body = await res.json()

      if (!res.ok) {
        return
      }

      setGenres(body)
      setIsLoading(false)
    }

    doStuff()
  }, [])

  if (status === 'unauthenticated' || isLoading) {
    return null
  }

  return (
    <div css={styles.root}>
      <div css={styles.genreContainer}>
        {genres.length !== 0 ? (
          genres.map((genre) => <Genre key={genre} genre={genre} />)
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
