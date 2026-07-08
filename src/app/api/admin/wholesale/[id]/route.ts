import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyCsrf } from '@/lib/csrf'

// PUT /api/admin/wholesale/[id] - Update wholesale application status
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
    const { status, message } = body // message is optional note

    const existing = await prisma.wholesaleApplication.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const application = await prisma.wholesaleApplication.update({
      where: { id },
      data: { 
        status,
        message: message ? `${existing.message || ''}\n\n[Admin Note]: ${message}` : undefined
      },
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error('[Admin Wholesale PUT]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
