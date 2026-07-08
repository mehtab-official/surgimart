/**
 * @jest-environment node
 */
import { resend } from '@/lib/resend'

describe('lib/resend', () => {
  it('exports resend client', () => {
    expect(resend).toBeDefined()
  })
})
