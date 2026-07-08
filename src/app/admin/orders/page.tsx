import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { Search, Eye } from 'lucide-react'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const sp = await searchParams
  const query = sp.q || ''
  const page = parseInt(sp.page || '1')
  const limit = 10
  const skip = (page - 1) * limit

  const where = query ? {
    OR: [
      { orderNumber: { contains: query, mode: 'insensitive' as const } },
      { shippingEmail: { contains: query, mode: 'insensitive' as const } },
    ]
  } : {}

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-slate-800'>Orders</h2>
        <p className='text-slate-500'>Track and manage customer orders.</p>
      </div>

      {/* Search */}
      <div className='bg-white p-4 rounded-2xl border border-slate-200'>
        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
          <input 
            type='text' 
            placeholder='Search by Order # or Email...' 
            defaultValue={query}
            className='w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
          />
        </div>
      </div>

      <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='bg-slate-50 text-slate-500 font-medium'>
              <tr>
                <th className='px-6 py-4'>Order #</th>
                <th className='px-6 py-4'>Customer Email</th>
                <th className='px-6 py-4'>Total</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4'>Date</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {orders.map((order) => (
                <tr key={order.id} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4 font-bold'>{order.orderNumber}</td>
                  <td className='px-6 py-4'>{order.shippingEmail}</td>
                  <td className='px-6 py-4 font-bold text-blue-600'>{formatCurrency(order.total, 'USD')}</td>
                  <td className='px-6 py-4'>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-slate-500'>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className='p-2 text-slate-400 hover:text-blue-600 transition-colors inline-block'
                      title='View Details'
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='p-6 border-t border-slate-100 flex items-center justify-between'>
            <p className='text-sm text-slate-500'>
              Showing <span className='font-bold'>{(page - 1) * limit + 1}</span> to <span className='font-bold'>{Math.min(page * limit, total)}</span> of <span className='font-bold'>{total}</span> orders
            </p>
            <div className='flex items-center gap-2'>
              <Link 
                href={`/admin/orders?page=${page - 1}${query ? `&q=${query}` : ''}`}
                className={`px-4 py-2 text-sm font-bold rounded-lg border border-slate-200 ${page <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-slate-50'}`}
              >
                Previous
              </Link>
              <Link 
                href={`/admin/orders?page=${page + 1}${query ? `&q=${query}` : ''}`}
                className={`px-4 py-2 text-sm font-bold rounded-lg bg-blue-600 text-white ${page >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-blue-700'}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
