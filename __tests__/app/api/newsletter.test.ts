import { NextRequest } from 'next/server'
import { POST } from '@/app/api/newsletter/route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    newsletterSubscriber: {
      upsert: jest.fn().mockResolvedValue({ id: '1', email: 'test@test.com' })
    }
  }
}))

// Mock redis for dedup
jest.mock('@/lib/redis', () => ({
  redis: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK')
  }
}))

// Mock rateLimit helper
jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn().mockResolvedValue({ success: true, allowed: true })
}))

describe('api/newsletter', () => {
  it('returns 200 for valid email', async () => {
    const req = new NextRequest('http://localhost:3001/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
      headers: { 'Origin': 'http://localhost:3001' }
    })
    
    const response = await POST(req)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data.message).toBe('Subscribed')
  })

  it('returns 400 for invalid email', async () => {
    const req = new NextRequest('http://localhost:3001/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid' }),
      headers: { 'Origin': 'http://localhost:3001' }
    })
    
    const response = await POST(req)
    expect(response.status).toBe(400)
  })
})
