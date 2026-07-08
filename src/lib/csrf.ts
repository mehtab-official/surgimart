import { NextRequest } from 'next/server'

/**
 * Basic CSRF verification for API routes.
 * In a real app, this would check against a CSRF token in cookies.
 * For this implementation, we will verify the 'Origin' or 'Referer' header
 * matches the application's base URL.
 */
export function verifyCsrf(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')
  const host = req.headers.get('host')

  // In development, skip CSRF check entirely
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  const baseUrl = (process.env.NEXTAUTH_URL || `http://${host}`).replace(/\/$/, '')

  if (origin) {
    const originClean = origin.replace(/\/$/, '')
    return baseUrl === originClean || baseUrl.startsWith(originClean)
  }

  if (referer) {
    return referer.startsWith(baseUrl)
  }

  // No origin or referer — allow (server-side calls)
  return true
}
