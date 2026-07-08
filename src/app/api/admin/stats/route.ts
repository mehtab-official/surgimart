import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/stats - Dashboard statistics
export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
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

    return NextResponse.json({
      productCount,
      orderCount,
      totalRevenue: totalRevenue._sum.total || 0,
      lowStockProducts,
      recentOrders,
    })
  } catch (error) {
    console.error('[Admin Stats GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
