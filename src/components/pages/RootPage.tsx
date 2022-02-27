import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { _Artist } from '../../mongoose/Artist'
import { Artist } from '../artists/Artist'
import { Genre } from '../genre/Genre'
import { CoolCat } from '../shared/CoolCat'

type VisibleGenres = Record<string, boolean | undefined>

export const RootPage = () => {
  const { status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [artistsByGenre, setArtistsByGenre] = useState<Record<string, _Artist[]>>({})
  const [visibleGenres, setVisibleGenres] = useState<VisibleGenres>({})

  useEffect(() => {
    async function doStuff() {
      const res = await fetch('/api/artist/all')
      const body = await res.json()

      if (!res.ok) {
        return
      }

      setArtistsByGenre(body)
      setIsLoading(false)
    }

    doStuff()
  }, [])

  const handleToggleGenreVisibility = (genre: string) =>
    setVisibleGenres((prevState) => ({
      ...prevState,
      [genre]: !prevState[genre],
    }))

  if (status === 'unauthenticated' || isLoading) {
    return null
  }

  const hasArtists = Object.entries(artistsByGenre).some((genre) => genre.length)

  return (
    <div>
      {hasArtists ? (
        artistsByGenre.map((genre) => (
          <div key={genre}>
            <Genre name={genre} onToggleVisibility={() => handleToggleGenreVisibility(genre)} />

            {visibleGenres[genre] &&
              artistsByGenre[genre].map((artist) => <Artist key={artist.id} artist={artist} />)}
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
