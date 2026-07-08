/**
 * @jest-environment node
 */
import { POST } from '@/app/api/stripe/webhook/route'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: jest.fn()
    }
  }
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      updateMany: jest.fn().mockResolvedValue({ count: 1 })
    }
  }
}))

describe('api/stripe/webhook', () => {
  it('fails with missing signature', async () => {
    const req = new Request('http://localhost:3001/api/stripe/webhook', {
      method: 'POST',
      body: 'body'
    })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('processes payment_intent.succeeded', async () => {
    ;(stripe.webhooks.constructEvent as jest.Mock).mockReturnValue({
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_123' } }
    })
    const req = new Request('http://localhost:3001/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'sig' },
      body: 'body'
    })
    const res = await POST(req as any)
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.received).toBe(true)
    expect(prisma.order.updateMany).toHaveBeenCalled()
  })
})
