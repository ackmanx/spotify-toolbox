/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'

import { _Artist } from '../../mongoose/Artist'
import { AppHeader } from '../app-header/AppHeader'
import { Subheader } from '../app-header/Subheader'
import { ArtistCard } from '../cards/artist/ArtistCard'

interface Props {
  genre: string
}

export const ArtistsInGenrePage = ({ genre }: Props) => {
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
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </main>
    </>
  )
}
