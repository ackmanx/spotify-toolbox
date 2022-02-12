import { useEffect, useState } from 'react'

import { _Artist } from '../../mongoose/Artist'
import { Artist } from '../artists/Artist'
import { Genre } from '../genre/Genre'

type VisibleGenres = Record<string, boolean | undefined>

export const RootPage = () => {
  const [artistsByGenre, setArtistsByGenre] = useState<Record<string, _Artist[]>>({})
  const [visibleGenres, setVisibleGenres] = useState<VisibleGenres>({})

  useEffect(() => {
    async function doStuff() {
      const res = await fetch('/api/genre/artists')
      const body = await res.json()

      const visibleGenres: VisibleGenres = {}

      Object.keys(body).forEach((genre) => {
        visibleGenres[genre] = localStorage.getItem(genre) === 'true'
      })

      setVisibleGenres(visibleGenres)
      setArtistsByGenre(body)
    }

    doStuff()
  }, [])

  const handleToggleGenreVisibility = (genre: string) =>
    setVisibleGenres((prevState) => {
      const isGenreVisible = prevState[genre] == null ? false : !prevState[genre]

      localStorage.setItem(genre, isGenreVisible.toString())

      return {
        ...prevState,
        [genre]: isGenreVisible,
      }
    })

  const handleArtistRefreshForGenre = (genre: string, artists: _Artist[]) =>
    setArtistsByGenre((prevState) => ({
      ...prevState,
      [genre]: artists,
    }))

  return (
    <div>
      {Object.keys(artistsByGenre)
        .sort()
        .map((genre) => (
          <div key={genre}>
            <Genre
              name={genre}
              onToggleVisibility={() => handleToggleGenreVisibility(genre)}
              onRefresh={handleArtistRefreshForGenre}
            />

            {/* Visibility might be null if user has never toggled it */}
            {(visibleGenres[genre] || visibleGenres[genre] == null) &&
              artistsByGenre[genre].map((artist) => <Artist key={artist.id} artist={artist} />)}
          </div>
        ))}
    </div>
  )
}
