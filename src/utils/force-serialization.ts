/*
 * `getServerSideProps` and related NextJS functions require all props to be serializable.
 * However, they use a different method than returning from an API response directly.
 * With Mongoose/MongoDB the ID and version fields are not serializable with the NextJS method.
 */
export function forceSerialization<Props>(props: Props): Props {
  return JSON.parse(JSON.stringify(props))
}
