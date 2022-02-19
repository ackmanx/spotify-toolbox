// This is a type guard to allow you to use `.filter(Boolean)`
export function filterNonNull<T>(value: T | null | undefined): value is T {
  return value != null
}

export function removeDuplicates(source: any[], overlap: string[]) {
  return source.filter((item) => !overlap.includes(item.id))
}
