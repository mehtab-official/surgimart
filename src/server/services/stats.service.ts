import { prisma } from '@/lib/prisma'

export class StatsService {
  async getAdminStats() {
    const [
      productCount,
      orderCount,
      totalRevenue,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
      prisma.product.findMany({
        where: { stockCount: { lte: 10 } },
        take: 5,
        orderBy: { stockCount: 'asc' },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return {
      productCount,
      orderCount,
      totalRevenue: totalRevenue._sum.total || 0,
      lowStockProducts,
      recentOrders,
    }
  }
}

export const statsService = new StatsService()
