import { stripe } from '@/lib/stripe'

describe('lib/stripe', () => {
  it('exports stripe client', () => {
    expect(stripe).toBeDefined()
  })
})
