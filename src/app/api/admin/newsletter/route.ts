import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ subscribers })
  } catch (error) {
    console.error('[Admin Newsletter GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
