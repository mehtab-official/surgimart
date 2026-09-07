import { prisma } from '@/lib/prisma'

export class StockNotifyService {
  async subscribe(email: string, productId: string) {
    try {
      await prisma.stockNotification.create({
        data: { email, productId },
      })
      return { status: 'created', message: 'You will be notified when this product is back in stock.' }
    } catch (e: unknown) {
      const prismaError = e as { code?: string }
      if (prismaError.code === 'P2002') {
        return { status: 'already_subscribed', message: 'Already subscribed' }
      }
      throw e
    }
  }
}

export const stockNotifyService = new StockNotifyService()
