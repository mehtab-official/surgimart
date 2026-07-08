import { redis } from '@/lib/redis'

describe('lib/redis', () => {
  it('exports redis client', () => {
    expect(redis).toBeDefined()
  })
})
