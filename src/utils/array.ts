// This is a type guard to allow you to use `.filter(Boolean)`
import { _ViewedAlbum } from '../mongoose/User'

export function filterNonNull<T>(value: T | null | undefined): value is T {
  return value != null
}

export function removeDuplicates(source: any[], overlap: string[]) {
  return source.filter((item) => !overlap.includes(item.id))
}

export function isViewed(viewedAlbums: _ViewedAlbum[], albumId: string) {
  const isViewed = viewedAlbums.find((viewed) => viewed.id === albumId)
  return isViewed !== undefined
}
