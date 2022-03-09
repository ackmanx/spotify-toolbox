/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ImageProps } from 'next/dist/client/image'
import NextImage from 'next/image'
import NextLink from 'next/link'
import { ReactNode } from 'react'

/*
 * Images here use the `unoptimized` prop to tell Vercel not to optimize them automatically
 * This on-by-default service has limits and pricing after those limits
 * https://vercel.com/docs/concepts/image-optimization/limits-and-pricing
 */

type ButtonImageProps = ImageProps & {
  disabled?: boolean
  onClick(event: any): void
  disablePadding?: boolean
}

export const ButtonImage = ({ disabled, onClick, disablePadding, ...props }: ButtonImageProps) => (
  <button
    css={css`
      background-color: transparent;
      border: none;
      cursor: pointer;
      padding: ${disablePadding ? '0px' : 'revert'};
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
  children?: ReactNode
  href: string
  imageSrc: string | StaticImageData
  width: number
  height: number
}

export const ImageLink = ({ children, href, imageSrc, width, height }: ImageLinkProps) =>
  href.startsWith('http') ? (
    <a href={href} target='_blank' rel='noreferrer'>
      <NextImage src={imageSrc} width={width} height={height} unoptimized />
    </a>
  ) : (
    <NextLink href={href}>
      <a>
        <NextImage src={imageSrc} width={width} height={height} unoptimized />
        {children}
      </a>
    </NextLink>
  )
