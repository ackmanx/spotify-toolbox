import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import dbConnect from '../../../lib/db'
import { _Artist, Artist } from '../../../mongoose/Artist'
import { NextApiRequest, NextApiResponse } from 'next'
import { _User, User } from '../../../mongoose/User'

const scope = [
  'playlist-modify-public',
  'playlist-read-private',
  'streaming',
  'user-follow-read',
  'user-library-read',
  'user-read-email',
  'user-read-playback-state',
  'user-read-private',
  'user-modify-playback-state',
].join(' ')

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      SpotifyProvider({
        clientId: process.env.SPOTIFY_CLIENT_ID ?? '',
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? '',
        authorization: {
          url: 'https://accounts.spotify.com/authorize',
          params: { scope },
        },
      }),
    ],
    secret: process.env.SECRET,
    callbacks: {
      /*
       * Listen to JWT callbacks and put the Spotify access token on the JWT token
       * Account is provided on sign in, but not subsequent events
       */
      async jwt({ token, account }) {
        if (account) {
          token.accessToken = account.access_token
        }

        return token
      },
      /*
       * Listen to Session callbacks, which have access to the JWT token
       * To add more data to the session, you need to explicitly make it available here due to security reasons
       */
      async session({ session, token }) {
        session.accessToken = token.accessToken
        return session
      },
    },
    events: {
      signIn: async ({ user: loggedInUser }) => {
        await dbConnect()
        const result: _User | null = await User.findOne({ id: loggedInUser.id })

        if (!result) {
          const user = new User({ userId: loggedInUser.id })
          await user.save()
        }
      },
    },
  })
}
