/**
 * @jest-environment node
 */
import { POST, GET } from '@/app/api/orders/route'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { rateLimit } from '@/lib/rate-limit'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
    },
    order: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb({
      product: { 
        update: jest.fn(),
        findUnique: jest.fn().mockResolvedValue({ id: '1', stockCount: 99 })
      },
      order: { create: jest.fn().mockResolvedValue({ id: '1', orderNumber: 'SM-1234' }) }
    })),
  }
}))

jest.mock('@/lib/stripe', () => ({
  stripe: {
    paymentIntents: {
      retrieve: jest.fn()
    }
  }
}))

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockResolvedValue({ allowed: true })
}))

describe('api/orders', () => {
  it('creates an order successfully', async () => {
    ;(prisma.order.findUnique as jest.Mock).mockResolvedValueOnce(null)
    ;(prisma.product.findMany as jest.Mock).mockResolvedValueOnce([
      { id: '1', price: 10, stockCount: 100, inStock: true, name: 'Scalpel' }
    ])
    ;(stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValueOnce({
      status: 'succeeded',
      amount: 1000 // 10 * 100
    })

    const req = new Request('http://localhost:3001/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        cartItems: [{ id: '1', slug: 'scalpel', qty: 1, price: 10 }],
        shippingData: {
          firstName: 'Dr.', lastName: 'Ahmad', email: 'test@test.com',
          phone: '1234567', address1: '123 St', city: 'Lahore', country: 'PK'
        },
        paymentIntentId: 'pi_test'
      })
    })
    const res = await POST(req as any)
    expect(res.status).toBe(201)
  })

  it('retrieves an order successfully', async () => {
    ;(prisma.order.findFirst as jest.Mock).mockResolvedValueOnce({ id: '1', orderNumber: 'SM-12345678', shippingEmail: 'test@test.com' })
    const req = new Request('http://localhost:3001/api/orders?orderNumber=SM-12345678&email=test@test.com')
    const res = await GET(req as any)
    expect(res.status).toBe(200)
  })

  it('fails with invalid paymentIntentId format', async () => {
    const req = new Request('http://localhost:3001/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        cartItems: [{ id: '1', slug: 'scalpel', qty: 1, price: 10 }],
        shippingData: {
          firstName: 'Dr.', lastName: 'Ahmad', email: 'test@test.com',
          phone: '1234567890', address1: '123 St', city: 'Lahore', country: 'PK'
        },
        paymentIntentId: 'invalid_id'
      })
    })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('fails when product is not found in Prisma', async () => {
    ;(prisma.product.findMany as jest.Mock).mockResolvedValueOnce([])
    const req = new Request('http://localhost:3001/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        cartItems: [{ id: '999', slug: 'none', qty: 1, price: 10 }],
        shippingData: {
          firstName: 'Dr.', lastName: 'Ahmad', email: 'test@test.com',
          phone: '1234567890', address1: '123 St', city: 'Lahore', country: 'PK'
        },
        paymentIntentId: 'pi_test'
      })
    })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('not found')
  })

  it('fails when product is out of stock', async () => {
    ;(prisma.product.findMany as jest.Mock).mockResolvedValueOnce([
      { id: '1', price: 10, stockCount: 100, inStock: false, name: 'Scalpel' }
    ])
    const req = new Request('http://localhost:3001/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        cartItems: [{ id: '1', slug: 'scalpel', qty: 1, price: 10 }],
        shippingData: {
          firstName: 'Dr.', lastName: 'Ahmad', email: 'test@test.com',
          phone: '1234567890', address1: '123 St', city: 'Lahore', country: 'PK'
        },
        paymentIntentId: 'pi_test'
      })
    })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('out of stock')
  })

  it('handles existing order (idempotency)', async () => {
    ;(prisma.order.findUnique as jest.Mock).mockResolvedValueOnce({ orderNumber: 'SM-EXISTING' })
    ;(prisma.product.findMany as jest.Mock).mockResolvedValueOnce([
      { id: '1', price: 10, stockCount: 100, inStock: true, name: 'S' }
    ])
    const req = new Request('http://localhost:3001/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        cartItems: [{ id: '1', slug: 's', qty: 1, price: 10 }],
        shippingData: { firstName: 'A', lastName: 'B', email: 'e@e.com', phone: '1234567', address1: '12345', city: 'C', country: 'PK' },
        paymentIntentId: 'pi_test'
      })
    })
    const res = await POST(req as any)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ orderNumber: 'SM-EXISTING' })
  })

  it('fails when payment is not succeeded', async () => {
    ;(prisma.order.findUnique as jest.Mock).mockResolvedValueOnce(null)
    ;(prisma.product.findMany as jest.Mock).mockResolvedValueOnce([{ id: '1', price: 10, stockCount: 10, inStock: true, name: 'S' }])
    ;(stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValueOnce({ status: 'requires_payment_method' })
    
    const req = new Request('http://localhost:3001/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        cartItems: [{ id: '1', slug: 's', qty: 1, price: 10 }],
        shippingData: { firstName: 'A', lastName: 'B', email: 'e@e.com', phone: '1234567', address1: '12345', city: 'C', country: 'PK' },
        paymentIntentId: 'pi_test'
      })
    })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Payment not confirmed' })
  })

  it('fails when amount mismatch', async () => {
    ;(prisma.order.findUnique as jest.Mock).mockResolvedValueOnce(null)
    ;(prisma.product.findMany as jest.Mock).mockResolvedValueOnce([{ id: '1', price: 20, stockCount: 10, inStock: true, name: 'S' }])
    ;(stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValueOnce({ status: 'succeeded', amount: 1000 }) // expects 2000
    
    const req = new Request('http://localhost:3001/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        cartItems: [{ id: '1', slug: 's', qty: 1, price: 20 }],
        shippingData: { firstName: 'A', lastName: 'B', email: 'e@e.com', phone: '1234567', address1: '12345', city: 'C', country: 'PK' },
        paymentIntentId: 'pi_test'
      })
    })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('fails when rate limited', async () => {
    ;(rateLimit as jest.Mock).mockResolvedValueOnce({ allowed: false, retryAfter: 60 })
    const req = new Request('http://localhost:3001/api/orders', { method: 'POST' })
    const res = await POST(req as any)
    expect(res.status).toBe(429)
  })
})
