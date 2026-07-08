/**
 * @jest-environment node
 */
import { POST } from '@/app/api/create-payment-intent/route'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/stripe', () => ({
  stripe: {
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ client_secret: 'pi_test_secret_123' })
    }
  },
  createPaymentIntent: jest.fn().mockResolvedValue({ client_secret: 'pi_test_secret_123' })
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn().mockResolvedValue([{ id: '1', price: 10, inStock: true }])
    }
  }
}))

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockResolvedValue({ allowed: true })
}))

describe('api/create-payment-intent', () => {
  it('creates a payment intent', async () => {
    const req = new Request('http://localhost:3001/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        cartItems: [{ id: '1', qty: 1 }],
        idempotencyKey: 'test-key'
      })
    })
    const res = await POST(req as any)
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.clientSecret).toBe('pi_test_secret_123')
  })
})
