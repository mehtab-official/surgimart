import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { Search, Eye, Clock, CheckCircle2, MessageSquare, ArrowLeft } from 'lucide-react'

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

  let quotes: any[] = []
  let total = 0

  try {
    const where = query ? {
      OR: [
        { productName: { contains: query, mode: 'insensitive' as const } },
        { email: { contains: query, mode: 'insensitive' as const } },
        { name: { contains: query, mode: 'insensitive' as const } },
      ]
    } : {}

    const [dbQuotes, dbTotal] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.quoteRequest.count({ where }),
    ])

    quotes = dbQuotes
    total = dbTotal
  } catch (err) {
    console.warn('Prisma DB query in AdminQuotesPage fell back to empty list:', err)
  }

  return (
    <div className='space-y-6'>
      <Link href='/admin' className='inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors'>
        <ArrowLeft size={14} /> Back to Overview
      </Link>

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <span className='px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30'>
              B2B Inquiries Desk
            </span>
            <span className='text-xs text-slate-400'>• {total} Total RFQs</span>
          </div>
          <h2 className='text-2xl font-bold text-white tracking-tight'>Quote Requests (RFQ)</h2>
          <p className='text-slate-400 text-sm'>Review, track, and respond to incoming export quotes and pricing inquiries.</p>
        </div>
      </div>

      <div className='bg-[#0a1426] p-4 rounded-2xl border border-slate-800/80 shadow-md'>
        <div className='relative max-w-md'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500' size={17} />
          <form method='GET' action='/admin/quotes'>
            <input 
              name='q'
              type='text' 
              placeholder='Search by product, email or buyer name...' 
              defaultValue={query}
              className='w-full pl-10 pr-4 py-2 bg-slate-900/80 text-white placeholder:text-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400 text-sm'
            />
          </form>
        </div>
      </div>

      <div className='bg-[#0a1426] rounded-2xl border border-slate-800/80 shadow-md overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='bg-slate-900/70 text-slate-400 font-bold uppercase tracking-wider text-[10px]'>
              <tr>
                <th className='px-6 py-4'>Product / Instrument</th>
                <th className='px-6 py-4'>Buyer</th>
                <th className='px-6 py-4'>Quantity</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4'>Date</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60 text-slate-300'>
              {quotes.length > 0 ? quotes.map((quote) => (
                <tr key={quote.id} className='hover:bg-slate-800/30 transition-colors'>
                  <td className='px-6 py-4'>
                    <div className='min-w-0 max-w-[240px]'>
                      <p className='font-bold text-white truncate text-sm'>{quote.productName}</p>
                      <p className='text-[10px] text-amber-400/80 font-mono font-bold uppercase'>ID: {quote.productId}</p>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <p className='font-semibold text-slate-200'>{quote.name}</p>
                    <p className='text-[10px] text-slate-400'>{quote.email}</p>
                  </td>
                  <td className='px-6 py-4 font-mono font-bold text-amber-400 text-sm'>{quote.qty} pcs</td>
                  <td className='px-6 py-4'>
                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                      quote.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {quote.status === 'pending' ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                      {quote.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-slate-400 font-medium'>
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <Link 
                      href={`/admin/quotes/${quote.id}`}
                      className='p-2 text-slate-400 hover:text-amber-400 transition-colors inline-block'
                      title='View Details'
                    >
                      <Eye size={17} />
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className='px-6 py-12 text-center text-slate-400'>
                    <MessageSquare size={32} className='mx-auto mb-2 opacity-30 text-slate-400' />
                    No quote requests submitted yet. Prospective buyers can submit RFQs from any product page or the /quote portal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
