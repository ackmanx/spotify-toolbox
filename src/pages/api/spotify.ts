import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

// This can be the type of the NextApiResponse<Data>
type Data = {
  content?: string
  error?: string
}

/*
 * This is an example of an API call to Spotify that requires authentication
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (session) {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    res.send(await response.json())
  } else {
    res.send({
      error: 'You must be sign in to view the protected content on this page.',
    })
  }
}
