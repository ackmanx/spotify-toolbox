/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { ImageLink } from '../shared/Image'
import BitpopIcon from './images/bitpop.png'
import ChineseIcon from './images/chinese.png'
import ClubIcon from './images/club.png'
import EbmIcon from './images/ebm.png'
import GermanIcon from './images/german.png'
import MiscIcon from './images/misc.png'
import RockIcon from './images/rock.png'
import SynthwaveIcon from './images/synthwave.png'
import UnknownIcon from './images/unknown.png'

interface Props {
  genre: string
}

const styles = {
  root: css`
    margin: 20px;
    font-size: 24px;
    background-color: #f5f5f5;

    transform: scale(100%);
    transition: transform 200ms;
    cursor: pointer;

    &:hover {
      transform: scale(105%);
      transition: transform 200ms;
    }

    a {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 30px;
    }
  `,
}

const genreToIcon: Record<string, StaticImageData> = {
  bitpop: BitpopIcon,
  chinese: ChineseIcon,
  club: ClubIcon,
  ebm: EbmIcon,
  german: GermanIcon,
  misc: MiscIcon,
  rock: RockIcon,
  synthwave: SynthwaveIcon,
  unknown: UnknownIcon,
}

export const Genre = ({ genre }: Props) => (
  <div css={styles.root}>
    <ImageLink href={`/app/genre/${genre}`} imageSrc={genreToIcon[genre]} width={50} height={50}>
      {genre}
    </ImageLink>
  </div>
)
