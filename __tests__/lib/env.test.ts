import { env } from '@/lib/env'

describe('Env configuration', () => {
  it('should have basic env vars defined', () => {
    // These should be set in jest.setup.ts or process.env
    expect(env.DATABASE_URL).toBeDefined()
  })
})
