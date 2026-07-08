import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({ email: z.string().email(), productId: z.string() })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

    // H-6: Rate limiting on stock-notify endpoint
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const rl = await rateLimit(`stocknotify_rate:${ip}`, 10, 3600)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 3600) } }
      )
    }

    await prisma.stockNotification.create({
      data: { email: parsed.data.email, productId: parsed.data.productId },
    })
    return NextResponse.json(
      { message: 'You will be notified when this product is back in stock.' },
      { status: 201 }
    )
  } catch (e: unknown) {
    const prismaError = e as { code?: string }
    if (prismaError.code === 'P2002') {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 })
    }
    console.error('Stock notification error:', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
