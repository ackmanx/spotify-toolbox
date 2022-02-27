/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react'

import { _Artist } from '../../mongoose/Artist'
import { Artist } from '../artists/Artist'
import { Subheader } from '../header/Subheader'

interface Props {
  genre: string
}

export const GenrePage = ({ genre }: Props) => {
  const [artists, setArtists] = useState<_Artist[]>([])

  useEffect(() => {
    async function doStuff() {
      const res = await fetch(`/api/artist/genre/${genre}`)
      setArtists(await res.json())
    }

    doStuff()
  }, [genre])

  if (!artists) {
    return null
  }

  return (
    <div>
      <Subheader name='artists' />

      {artists.map((artist) => (
        <Artist key={artist.id} artist={artist} />
      ))}
    </div>
  )
}
