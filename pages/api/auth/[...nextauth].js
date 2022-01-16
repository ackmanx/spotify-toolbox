import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    providers: [
      SpotifyProvider({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
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
  })
}
