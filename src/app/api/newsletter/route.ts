import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { resend } from '@/lib/resend'
import { rateLimit } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'

// H-4: Create a model or at minimum use upsert to persist subscribers
const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })

    if (process.env.E2E_MOCK === 'true') {
      return NextResponse.json({ message: 'Subscribed (E2E Mock)' }, { status: 201 })
    }

    // H-5: Rate limiting on newsletter endpoint
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const limit = process.env.NODE_ENV === 'test' ? 100 : 3
    const rl = await rateLimit(`newsletter_rate:${ip}`, limit, 3600)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 3600) } }
      )
    }

    // H-4: Check duplicate via stock notification table repurpose or simple Redis dedup
    const dedupKey = `newsletter:${parsed.data.email}`
    const { redis } = await import('@/lib/redis')
    const exists = await redis.get(dedupKey)
    if (exists) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 })
    }
    await redis.set(dedupKey, '1')

    // Persist to database
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email },
    })

    if (process.env.NODE_ENV !== 'test') {
      await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: parsed.data.email,
        subject: 'Welcome to Submed Ortho Newsletter',
        html: '<p>Thank you for subscribing to our newsletter! You will receive exclusive deals and new product announcements.</p>',
      })
    }

    return NextResponse.json({ message: 'Subscribed' }, { status: 201 })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
