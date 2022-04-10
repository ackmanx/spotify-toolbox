/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'

import { _Artist } from '../../../mongoose/Artist'
import { AppHeader } from '../../app-header/AppHeader'
import { Subheader } from '../../shared/Subheader'
import { ActionBar } from './ActionBar'
import { ArtistCard } from './ArtistCard'

interface Props {
  genre: string
}

const styles = {
  cards: css`
    text-align: center;
  `,
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

  return (
    <>
      <AppHeader title={genre} />
      <ActionBar />
      <main>
        <Subheader name='artists' />
        <div css={styles.cards}>
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </main>
    </>
  )
}
