import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyCsrf } from '@/lib/csrf'

// PUT /api/admin/quotes/[id] - Update quote status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { status } = body

    const quote = await prisma.quoteRequest.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(quote)
  } catch (error) {
    console.error('[Admin Quote PUT]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
