import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (pathname.startsWith('/account') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname.startsWith('/admin') && session?.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url))
  }
})

export const config = { matcher: ['/account/:path*', '/admin/:path*'] }
