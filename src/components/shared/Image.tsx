import NextImage from 'next/image'
import { ImageProps } from 'next/dist/client/image'
import styled from '@emotion/styled'

const Button = styled.button`
  background-color: transparent;
  border: none;
`

type Props = ImageProps & { onClick(event: any): void }

export const ButtonImage = ({ onClick, ...props }: Props) => (
  <Button onClick={onClick}>
    <NextImage {...props} />
  </Button>
)
