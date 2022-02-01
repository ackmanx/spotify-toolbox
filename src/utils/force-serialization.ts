/*
 * `getServerSideProps` and related NextJS functions require all props to be serializable.
 * However, they use a different method than returning from an API response directly.
 * With Mongoose/MongoDB the ID and version fields are not serializable with the NextJS method.
 */
export const forceSerialization = (props: any) => JSON.parse(JSON.stringify(props))
