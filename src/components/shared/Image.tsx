import NextImage from 'next/image'
import { ImageProps } from 'next/dist/client/image'

export const Image = (props: ImageProps) => <div>
  <NextImage {...props} />
</div>
