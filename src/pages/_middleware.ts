import { getToken } from 'next-auth/jwt'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith('/app')) {
    //@ts-expect-error This works, but req is missing properties to be fully type-safe. I don't care.
    const session = await getToken({ req, secret: process.env.SECRET ?? '' })

    if (!session) {
      return NextResponse.redirect('/api/auth/signin')
    }
  }

  return NextResponse.next()
}
