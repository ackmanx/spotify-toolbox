/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'

import { _Artist } from '../../mongoose/Artist'
import { AppHeader } from '../app-header/AppHeader'
import { Subheader } from '../app-header/Subheader'
import { Artist } from '../cards/artist/Artist'

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
    <>
      <AppHeader title={genre} artists={artists} isRefreshable />
      <main
        css={css`
          text-align: center;
        `}
      >
        <Subheader name='artists' />

        {artists.map((artist) => (
          <Artist key={artist.id} artist={artist} />
        ))}
      </main>
    </>
  )
}
