/**
 * @jest-environment node
 */
import { POST } from '@/app/api/revalidate/route'

describe('api/revalidate', () => {
  process.env.REVALIDATE_SECRET = 'test-secret'

  it('fails with invalid secret', async () => {
    const req = new Request('http://localhost:3001/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ secret: 'wrong' })
    })
    const res = await POST(req as any)
    expect(res.status).toBe(401)
  })

  it('succeeds with valid secret', async () => {
    const req = new Request('http://localhost:3001/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ secret: 'test-secret', slug: 'test' })
    })
    const res = await POST(req as any)
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.revalidated).toBe(true)
  })
})
