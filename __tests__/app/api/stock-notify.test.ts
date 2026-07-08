/**
 * @jest-environment node
 */
import { POST } from '@/app/api/stock-notify/route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    stockNotification: {
      create: jest.fn().mockResolvedValue({ id: '1' })
    }
  }
}))

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockResolvedValue({ allowed: true })
}))

describe('api/stock-notify', () => {
  it('submits a valid notification request', async () => {
    const req = new Request('http://localhost:3001/api/stock-notify', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', productId: 'p1' }),
      headers: { 'Origin': 'http://localhost:3001' }
    })
    const res = await POST(req as any)
    expect(res.status).toBe(201)
  })
})
