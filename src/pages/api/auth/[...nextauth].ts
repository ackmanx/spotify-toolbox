import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import dbConnect from '../../../lib/db'
import { _Artist, mArtist, buildArtist } from '../../../mongoose/Artist'
import { NextApiRequest, NextApiResponse } from 'next'
import { _User, mUser } from '../../../mongoose/User'
import { GetAll } from '../../../utils/server/spotify-web-api'
import { HydratedDocument } from 'mongoose'
import { Many } from '../../../mongoose/types'

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

        return session
      },
    },
    events: {
      /*
       * Check if this is the first time the user has logged in and seed the DB if it is
       */
      signIn: async ({ user: loggedInUser, account }) => {
        await dbConnect()

        const userInDB: HydratedDocument<_User> | null = await mUser.findOne({
          id: loggedInUser.id,
        })

        if (!userInDB) {
          const followedArtists = await GetAll.followedArtists(account.access_token ?? '')

          const artists: Many<_Artist> = []
          const followedArtistsIDs: string[] = []

          followedArtists.forEach((artist) => {
            artists.push(buildArtist(artist))
            followedArtistsIDs.push(artist.id)
          })

          const user = new mUser()
          user.userId = loggedInUser.id
          user.followedArtists = followedArtistsIDs

          await user.save()
          await mArtist.bulkSave(artists)
        }
      },
    },
  })
}
