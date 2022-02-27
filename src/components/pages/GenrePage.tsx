/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'

import { _Artist } from '../../mongoose/Artist'
import { AlbumsByReleaseType } from '../../pages/artist/[artistId]'
import { Artist } from '../artists/Artist'
import { AlbumMenu } from '../card/AlbumMenu'
import { Card } from '../card/Card'

interface Props {
  genre: string
}

const styles = {
  header: css`
    text-align: left;
    padding: 0 20px;

    h2 {
      margin: 0;
      color: #ebebeb;
      font-size: 72px;
    }
  `,
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
      <div css={styles.header}>
        <h2>{genre}</h2>
      </div>

      {artists.map((artist) => (
        <Artist key={artist.id} artist={artist} />
      ))}
    </div>
  )
}
