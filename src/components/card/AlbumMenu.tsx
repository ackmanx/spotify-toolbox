interface Props {
  albumId: string
  className?: string //styled-components
  onClick(): void
}

export const AlbumMenu = ({ albumId, className, onClick }: Props) => {
  return (
    <h3 className={className} data-album-id={albumId} onClick={onClick}>
      {albumId}
    </h3>
  )
}
