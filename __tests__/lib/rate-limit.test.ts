/**
 * @jest-environment node
 */
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      pipeline: jest.fn().mockReturnThis(),
      incr: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([[null, 1], [null, 1]]),
      on: jest.fn(),
      quit: jest.fn(),
    }
  })
})

import { rateLimit } from '@/lib/rate-limit'

describe('rate-limit', () => {
  it('allows requests within limit', async () => {
      const res = await rateLimit('test', 10, 60)
      expect(res.allowed).toBe(true)
  })
})
