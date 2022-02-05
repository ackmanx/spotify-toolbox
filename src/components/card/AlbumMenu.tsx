interface Props {
  albumId: string
  className?: string
}

export const AlbumMenu = ({ albumId, className }: Props) => {
  return <h3 className={className}>{albumId}</h3>
}
