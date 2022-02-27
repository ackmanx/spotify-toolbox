import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { Genre } from '../genre/Genre'
import { CoolCat } from '../shared/CoolCat'

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
      {genres.length !== 0 ? (
        genres.map((genre) => (
          <div key={genre}>
            <Genre name={genre} />
          </div>
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
