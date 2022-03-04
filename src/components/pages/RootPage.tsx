/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { Genre } from '../genre/genre'
import { Subheader } from '../header/Subheader'
import { CoolCat } from '../shared/CoolCat'

const styles = {
  genres: css`
    display: flex;
    flex-direction: column;
    align-items: center;
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
    <div>
      <Subheader name='genres' />

      {genres.length !== 0 ? (
        <div css={styles.genres}>
          {genres.map((genre) => (
            <Genre key={genre} genre={genre} />
          ))}
        </div>
      ) : (
        <CoolCat
          header="It looks like you've got no followed artists."
          subheader='Level up and try again.'
        />
      )}
    </div>
  )
}
