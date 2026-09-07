import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { newsletterService } from '@/server/services/newsletter.service'
import { requireAdmin, checkRateLimit, getClientIp } from '@/server/middlewares'

const NewsletterSchema = z.object({
  email: z.string().email(),
})

export class NewsletterController {
  async subscribe(req: NextRequest) {
    try {
      const body = await req.json()
      const parsed = NewsletterSchema.safeParse(body)
      if (!parsed.success) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })

      if (process.env.E2E_MOCK === 'true') {
        return NextResponse.json({ message: 'Subscribed (E2E Mock)' }, { status: 201 })
      }

      const ip = getClientIp(req)
      const limit = process.env.NODE_ENV === 'test' ? 100 : 3
      const rl = await checkRateLimit(`newsletter_rate:${ip}`, limit, 3600)
      if ('response' in rl) return rl.response

      const result = await newsletterService.subscribe(parsed.data.email)
      if (result.alreadySubscribed) {
        return NextResponse.json({ message: 'Already subscribed' }, { status: 200 })
      }

      return NextResponse.json({ message: 'Subscribed' }, { status: 201 })
    } catch (error) {
      console.error('Newsletter subscribe error:', error)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }
  }

  async listSubscribers() {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    try {
      const subscribers = await newsletterService.listSubscribers()
      return NextResponse.json({ subscribers })
    } catch (error) {
      console.error('[Admin Newsletter GET]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

export const newsletterController = new NewsletterController()
