import { NextRequest } from 'next/server'

/**
 * CSRF verification for API routes.
 * Verifies the Origin or Referer header matches the application's base URL.
 */
export function verifyCsrf(req: NextRequest): boolean {
  // In development, skip CSRF check entirely
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')
  const host = req.headers.get('host')

  // Build list of allowed origins — NEXTAUTH_URL + the actual host
  const allowedOrigins: string[] = []

  if (process.env.NEXTAUTH_URL) {
    allowedOrigins.push(process.env.NEXTAUTH_URL.replace(/\/$/, ''))
  }

  if (host) {
    allowedOrigins.push(`https://${host}`.replace(/\/$/, ''))
    allowedOrigins.push(`http://${host}`.replace(/\/$/, ''))
  }

  if (origin) {
    const originClean = origin.replace(/\/$/, '')
    return allowedOrigins.some(
      allowed => allowed === originClean || originClean.startsWith(allowed)
    )
  }

  if (referer) {
    return allowedOrigins.some(allowed => referer.startsWith(allowed))
  }

  // No origin or referer — allow (server-side / curl calls)
  return true
}
