import { useEffect, useState } from 'react'

import { _Artist } from '../../mongoose/Artist'
import { Artist } from '../artists/Artist'
import { Genre } from '../genre/Genre'

interface Props {
  artistsByGenre: Record<string, _Artist[]>
  viewedAlbums: string[]
}

type VisibleGenres = Record<string, boolean | undefined>

export const RootPage = ({ artistsByGenre, viewedAlbums }: Props) => {
  const [genres, setGenres] = useState<Record<string, _Artist[]>>(artistsByGenre)
  const [visibleGenres, setVisibleGenres] = useState<VisibleGenres>({})

  useEffect(() => {
    const visibleGenres: VisibleGenres = {}

    Object.keys(genres).forEach((genre) => {
      visibleGenres[genre] = localStorage.getItem(genre) === 'true'
    })

    setVisibleGenres(visibleGenres)
  }, [genres])

  const handleGenreHide = (genre: string) =>
    setVisibleGenres((prevState) => {
      const isGenreVisible = prevState[genre] == null ? false : !prevState[genre]

      localStorage.setItem(genre, isGenreVisible.toString())

      return {
        ...prevState,
        [genre]: isGenreVisible,
      }
    })

  const handleGenreRefresh = (genre: string, artists: _Artist[]) =>
    setGenres((prevState) => ({
      ...prevState,
      [genre]: artists,
    }))

  const genresSorted = Object.keys(genres).sort()

  return (
    <div>
      {genresSorted.map((genre) => (
        <div key={genre}>
          <Genre
            name={genre}
            onClick={() => handleGenreHide(genre)}
            onRefresh={handleGenreRefresh}
          />

          {(visibleGenres[genre] || visibleGenres[genre] == null) &&
            genres[genre].map((artist) => {
              const hasUnviewedAlbums = artist.albums.some(
                (album) => !viewedAlbums.includes(album.id)
              )

              return hasUnviewedAlbums ? <Artist key={artist.id} artist={artist} /> : null
            })}
        </div>
      ))}
    </div>
  )
}
