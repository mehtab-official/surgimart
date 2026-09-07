import { NextResponse } from 'next/server'
import type { Session } from 'next-auth'

export async function requireAuth(): Promise<{ session: Session } | { response: NextResponse }> {
  const { auth } = await import('@/lib/auth')
  const session = await auth()
  if (!session?.user) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { session }
}

export async function requireAdmin(): Promise<{ session: Session } | { response: NextResponse }> {
  const { auth } = await import('@/lib/auth')
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 403 }) }
  }
  return { session }
}
