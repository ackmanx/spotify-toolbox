interface Props {
  albumId: string
  className?: string
  onClick(): void
}

export const AlbumMenu = ({ albumId, className, onClick }: Props) => {
  return (
    <h3 className={className} onClick={onClick}>
      {albumId}
    </h3>
  )
}
