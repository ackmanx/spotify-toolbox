import { _ViewedAlbums } from '../mongoose/User'

// This is a type guard to allow you to use `.filter(Boolean)`
export function filterNonNull<T>(value: T | null | undefined): value is T {
  return value != null
}

// This is usually used to avoid trying to save something to the DB that already exists when doing batch saving
export function removeDuplicates(source: any[], overlap: string[]) {
  return source.filter((item) => !overlap.includes(item.id))
}

export function isViewed(viewedAlbums: _ViewedAlbums, artistId: string, albumId: string) {
  return viewedAlbums[artistId]?.find((album) => album.id === albumId) !== undefined
}
