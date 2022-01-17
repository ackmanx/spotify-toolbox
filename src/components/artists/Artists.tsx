import { useSession } from 'next-auth/react'

const Component = () => {
  const { data: session } = useSession()

  return <div>hello artists</div>
}

export default Component
