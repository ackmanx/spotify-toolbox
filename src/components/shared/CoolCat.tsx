import { ButtonImage } from './Image'
import CoolCatImage from './images/cool-cat.png'

interface Props {
  header: string
  subheader?: string
  onClick?: () => void
}

const noop = () => {}

export const CoolCat = ({ onClick = noop, header, subheader = '' }: Props) => (
  <div>
    <h2>{header}</h2>
    <h2>{subheader}</h2>
    <ButtonImage src={CoolCatImage} onClick={onClick} />
  </div>
)
