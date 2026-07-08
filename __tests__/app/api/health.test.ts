/**
 * @jest-environment node
 */
import { GET } from '@/app/api/health/route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn().mockResolvedValue([{ ok: 1 }])
  }
}))

describe('api/health', () => {
  it('returns 200 and healthy status', async () => {
    const response = await GET()
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.status).toBe('ok')
    expect(data.db).toBe('connected')
  })

  it('returns 503 if database fails', async () => {
    ;(prisma.$queryRaw as jest.Mock).mockRejectedValueOnce(new Error('DB Down'))
    const response = await GET()
    const data = await response.json()
    
    expect(response.status).toBe(503)
    expect(data.status).toBe('error')
    expect(data.db).toBe('disconnected')
  })
})
