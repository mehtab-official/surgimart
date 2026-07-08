/**
 * @jest-environment node
 */
import { POST } from '@/app/api/wholesale/route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    wholesaleApplication: {
      create: jest.fn().mockResolvedValue({ id: '1' })
    }
  }
}))

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockResolvedValue({ allowed: true })
}))

describe('api/wholesale', () => {
  it('submits a valid wholesale inquiry', async () => {
    const req = new Request('http://localhost:3001/api/wholesale', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'Test', lastName: 'User',
        email: 'test@test.com', phone: '123456', 
        organization: 'Test Biz', country: 'PK',
        monthlyVolume: 'High', categories: ['Surgical']
      }),
      headers: { 'Origin': 'http://localhost:3001' }
    })
    const res = await POST(req as any)
    expect(res.status).toBe(201)
  })
})
