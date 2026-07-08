import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { Search, Eye, Clock, CheckCircle2 } from 'lucide-react'

export default async function AdminQuotesPage({
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
      { productName: { contains: query, mode: 'insensitive' as const } },
      { email: { contains: query, mode: 'insensitive' as const } },
      { name: { contains: query, mode: 'insensitive' as const } },
    ]
  } : {}

  const [quotes] = await Promise.all([
    prisma.quoteRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.quoteRequest.count({ where }),
  ])

  // const totalPages = Math.ceil(total / limit)

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-slate-800'>Quote Requests</h2>
        <p className='text-slate-500'>Review and respond to custom pricing requests.</p>
      </div>

      <div className='bg-white p-4 rounded-2xl border border-slate-200'>
        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
          <input 
            type='text' 
            placeholder='Search by Product, Email or Name...' 
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
                <th className='px-6 py-4'>Product</th>
                <th className='px-6 py-4'>Customer</th>
                <th className='px-6 py-4'>Qty</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4'>Date</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {quotes.map((quote) => (
                <tr key={quote.id} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4'>
                    <div className='min-w-0'>
                      <p className='font-bold text-slate-800 truncate'>{quote.productName}</p>
                      <p className='text-[10px] text-slate-400 font-bold uppercase'>ID: {quote.productId}</p>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <p className='font-medium'>{quote.name}</p>
                    <p className='text-xs text-slate-500'>{quote.email}</p>
                  </td>
                  <td className='px-6 py-4 font-bold'>{quote.qty}</td>
                  <td className='px-6 py-4'>
                    <span className={`flex items-center gap-1.5 w-fit px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      quote.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {quote.status === 'pending' ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                      {quote.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-slate-500'>
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <Link 
                      href={`/admin/quotes/${quote.id}`}
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

        {/* Pagination omitted for brevity, identical logic to orders */}
      </div>
    </div>
  )
}
