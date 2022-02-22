/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ImageProps } from 'next/dist/client/image'
import NextImage from 'next/image'
import Link from 'next/link'

type ButtonImageProps = ImageProps & { disabled?: boolean; onClick(event: any): void }

export const ButtonImage = ({ disabled, onClick, ...props }: ButtonImageProps) => (
  <button
    css={css`
      background-color: transparent;
      border: none;
      cursor: pointer;
    `}
    disabled={disabled}
    onClick={onClick}
  >
    {/* Using the loader prop lets you bypass NextJS' external domain requirement in next.config.ts */}
    {/* I use this because if Spotify is connected to FB, don't know what domain FB will use for profile pic */}
    <NextImage {...props} loader={({ src }) => src} unoptimized />
  </button>
)

interface ImageLinkProps {
  href: string
  imageSrc: string | StaticImageData
  width: number
  height: number
}

export const ImageLink = ({ href, imageSrc, width, height }: ImageLinkProps) =>
  href.startsWith('http') ? (
    <a href={href} target='_blank' rel='noreferrer'>
      <NextImage src={imageSrc} width={width} height={height} />
    </a>
  ) : (
    <Link href={href}>
      <a>
        <NextImage src={imageSrc} width={width} height={height} />
      </a>
    </Link>
  )
