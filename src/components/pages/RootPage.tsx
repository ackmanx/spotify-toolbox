/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Subheader } from '../header/Subheader'
import { CoolCat } from '../shared/CoolCat'

const styles = {
  root: css`
    a {
      border: 1px solid black;
      margin: 10px;
      width: 200px;
      height: 100px;
      display: inline-block;
      font-size: 24px;
    }
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
      <Subheader name='genres' />

      {genres.length !== 0 ? (
        genres.map((genre) => (
          <Link key={genre} href={`/genre/${genre}`}>
            {genre}
          </Link>
        ))
      ) : (
        <CoolCat
          header="It looks like you've got no followed artists."
          subheader='Level up and try again.'
        />
      )}
    </div>
  )
}
