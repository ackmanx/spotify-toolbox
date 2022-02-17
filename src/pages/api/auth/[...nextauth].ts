import { HydratedDocument } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

import dbConnect from '../../../lib/db'
import { _User, mUser } from '../../../mongoose/User'

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
          token.userId = token.sub
          token.accessToken = account.access_token
          token.expiresAt = account.expires_at //access token expiration date in seconds
        }

        return token
      },
      /*
       * Listen to Session callbacks, which have access to the JWT token
       * To add more data to the session, you need to explicitly make it available here due to security reasons
       */
      async session({ session, token }) {
        session.userId = token.userId
        session.accessToken = token.accessToken
        session.expiresAt = token.expiresAt
        session.isExpired = (token.expiresAt as number) * 1000 - new Date().getTime() < 0

        return session
      },
    },
    events: {
      signIn: async ({ user: loggedInUser, account }) => {
        await dbConnect()

        const userInDB: HydratedDocument<_User> | null = await mUser.findOne({
          userId: loggedInUser.id,
        })

        if (!userInDB) {
          const user = new mUser()
          user.userId = loggedInUser.id
          user.isNewUser = true
          await user.save()
        }
      },
    },
  })
}
