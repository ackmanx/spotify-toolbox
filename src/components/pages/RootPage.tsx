import { useEffect, useState } from 'react'

import { _Artist } from '../../mongoose/Artist'
import { Artist } from '../artists/Artist'
import { Genre } from '../genre/Genre'

type VisibleGenres = Record<string, boolean | undefined>

export const RootPage = () => {
  const [genres, setGenres] = useState<Record<string, _Artist[]>>({})
  const [visibleGenres, setVisibleGenres] = useState<VisibleGenres>({})

  useEffect(() => {
    const visibleGenres: VisibleGenres = {}

    Object.keys(genres).forEach((genre) => {
      visibleGenres[genre] = localStorage.getItem(genre) === 'true'
    })

    setVisibleGenres(visibleGenres)
  }, [genres])

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
    setGenres((prevState) => ({
      ...prevState,
      [genre]: artists,
    }))

  return (
    <div>
      {Object.keys(genres)
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
              genres[genre].map((artist) => <Artist key={artist.id} artist={artist} />)}
          </div>
        ))}
    </div>
  )
}
