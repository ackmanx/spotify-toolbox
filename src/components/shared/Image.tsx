import NextImage from 'next/image'
import { ImageProps } from 'next/dist/client/image'
import styled from '@emotion/styled'
import Link from 'next/link'

const Button = styled.button`
  background-color: transparent;
  border: none;
`

type ButtonImageProps = ImageProps & { onClick(event: any): void }

export const ButtonImage = ({ onClick, ...props }: ButtonImageProps) => (
  <Button onClick={onClick}>
    <NextImage {...props} />
  </Button>
)

interface ImageLinkProps {
  href: string
  imageSrc: string | StaticImageData
  width: number
  height: number
}

export const ImageLink = ({ href, imageSrc, width, height }: ImageLinkProps) => (
  <Link href={href}>
    <a>
      <NextImage src={imageSrc} width={width} height={height} />
    </a>
  </Link>
)
