import NextImage from 'next/image'
import { ImageProps } from 'next/dist/client/image'
import styled from '@emotion/styled'

const Button = styled.button`
  background-color: transparent;
  border: none;
`

export const Image = (props: ImageProps) => (
  <div>
    <NextImage {...props} />
  </div>
)

export const ButtonImage = ({ onClick, ...props }: ImageProps & { onClick(): void }) => (
  <Button onClick={onClick}>
    <NextImage {...props} />
  </Button>
)
