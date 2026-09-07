import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export class NewsletterService {
  async subscribe(email: string) {
    if (process.env.E2E_MOCK === 'true') {
      return { success: true, mock: true }
    }

    const dedupKey = `newsletter:${email}`
    const { redis } = await import('@/lib/redis')
    const exists = await redis.get(dedupKey)
    if (exists) {
      return { alreadySubscribed: true }
    }
    await redis.set(dedupKey, '1')

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    })

    if (process.env.NODE_ENV !== 'test') {
      await resend.emails.send({
        from: process.env.RESEND_FROM || 'orders@submedortho.com',
        to: email,
        subject: 'Welcome to Submed Ortho Newsletter',
        html: '<p>Thank you for subscribing to our newsletter! You will receive exclusive deals and new product announcements.</p>',
      }).catch(err => console.error('Newsletter email error:', err))
    }

    return { success: true }
  }

  async listSubscribers() {
    return prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }
}

export const newsletterService = new NewsletterService()
