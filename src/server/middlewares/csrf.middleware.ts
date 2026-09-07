import { NextRequest, NextResponse } from 'next/server'
import { verifyCsrf } from '@/lib/csrf'

export function requireCsrf(req: NextRequest): { success: true } | { response: NextResponse } {
  if (!verifyCsrf(req)) {
    return { response: NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 }) }
  }
  return { success: true }
}
