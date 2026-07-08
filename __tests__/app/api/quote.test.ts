/**
 * @jest-environment node
 */
import { POST } from '@/app/api/quote/route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    quoteRequest: {
      create: jest.fn().mockResolvedValue({ id: '1' })
    }
  }
}))

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockResolvedValue({ allowed: true })
}))

describe('api/quote', () => {
  it('submits a valid quote', async () => {
    const req = new Request('http://localhost:3001/api/quote', {
      method: 'POST',
      body: JSON.stringify({
        productId: 'p1', productName: 'Scalpel', qty: 10,
        name: 'Dr. Test', email: 'test@test.com', country: 'PK'
      }),
      headers: { 'Origin': 'http://localhost:3001' }
    })
    const res = await POST(req as any)
    expect(res.status).toBe(201)
  })
})
