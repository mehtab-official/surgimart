import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default async function AdminDashboard() {
  const [
    productCount,
    orderCount,
    totalRevenueAgg,
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

  const totalRevenue = totalRevenueAgg._sum.total || 0

  const stats = [
    { name: 'Total Products', value: productCount, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Orders', value: orderCount, icon: ShoppingCart, color: 'text-teal-600', bg: 'bg-teal-100' },
    { name: 'Total Revenue', value: formatCurrency(totalRevenue, 'USD'), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
  ]

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold text-slate-800'>Overview</h2>
        <p className='text-slate-500'>Welcome to your Submed Ortho admin dashboard.</p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {stats.map((stat) => (
          <div key={stat.name} className='bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm'>
            <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className='text-sm text-slate-500 font-medium'>{stat.name}</p>
              <p className='text-2xl font-bold text-slate-800'>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Recent Orders */}
        <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
          <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
            <h3 className='font-bold text-slate-800 flex items-center gap-2'>
              <TrendingUp size={20} className='text-blue-600' />
              Recent Orders
            </h3>
            <Link href='/admin/orders' className='text-sm font-bold text-blue-600 hover:underline'>View All</Link>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-slate-50 text-slate-500 font-medium'>
                <tr>
                  <th className='px-6 py-3'>Order #</th>
                  <th className='px-6 py-3'>Customer</th>
                  <th className='px-6 py-3'>Total</th>
                  <th className='px-6 py-3'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <tr key={order.id} className='hover:bg-slate-50 transition-colors'>
                    <td className='px-6 py-4 font-bold'>{order.orderNumber}</td>
                    <td className='px-6 py-4'>{order.shippingEmail}</td>
                    <td className='px-6 py-4 font-medium text-blue-600'>{formatCurrency(order.total, 'USD')}</td>
                    <td className='px-6 py-4'>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className='px-6 py-10 text-center text-slate-400'>No recent orders</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
          <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
            <h3 className='font-bold text-slate-800 flex items-center gap-2'>
              <AlertTriangle size={20} className='text-amber-500' />
              Low Stock Alerts
            </h3>
            <Link href='/admin/products' className='text-sm font-bold text-blue-600 hover:underline'>Manage Inventory</Link>
          </div>
          <div className='p-6 space-y-4'>
            {lowStockProducts.length > 0 ? lowStockProducts.map((product) => (
              <div key={product.id} className='flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100'>
                <div className='min-w-0'>
                  <p className='font-bold text-slate-800 truncate'>{product.name}</p>
                  <p className='text-xs text-slate-500'>SKU: {product.sku || 'N/A'}</p>
                </div>
                <div className='text-right'>
                  <p className={`font-bold ${product.stockCount === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                    {product.stockCount} left
                  </p>
                  <p className='text-[10px] text-slate-400 uppercase font-bold'>Quantity</p>
                </div>
              </div>
            )) : (
              <div className='text-center py-10 text-slate-400'>All products are in good stock</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
