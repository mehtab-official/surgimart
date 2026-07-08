import middleware from '@/middleware'
import { NextRequest } from 'next/server'

jest.mock('@/lib/auth', () => ({
  auth: jest.fn((cb) => (req: any) => cb(req))
}))

describe('Middleware', () => {
  it('allows through when no auth required', () => {
    const req = {
      nextUrl: { pathname: '/shop' },
      url: 'http://localhost/shop'
    } as any
    const res = (middleware as any)(req, { params: {} })
    expect(res).toBeUndefined()
  })

  it('redirects /account when no session', () => {
    const req = {
      nextUrl: { pathname: '/account' },
      url: 'http://localhost/account'
    } as any
    const res = (middleware as any)(req, { params: {} })
    expect(res).toBeDefined()
  })
})
