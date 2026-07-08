import { prisma as prismaClient } from '@/lib/prisma'

describe('lib/prisma', () => {
  it('exports prisma client', () => {
    expect(prismaClient).toBeDefined()
  })
})
