import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { 
  Package, 
  MessageSquare, 
  FolderDown, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Layers,
  ArrowUpRight,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { FALLBACK_PRODUCTS } from '@/lib/products'

export default async function AdminDashboard() {
  let productCount = FALLBACK_PRODUCTS.length
  let quoteCount = 0
  let pendingQuotes = 0
  let recentQuotes: any[] = []
  let featuredProducts: any[] = FALLBACK_PRODUCTS.slice(0, 4)

  try {
    const [pCount, qCount, pQuotes, quotes] = await Promise.all([
      prisma.product.count(),
      prisma.quoteRequest.count(),
      prisma.quoteRequest.count({ where: { status: 'pending' } }),
      prisma.quoteRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    if (pCount > 0) productCount = pCount
    quoteCount = qCount
    pendingQuotes = pQuotes
    recentQuotes = quotes
  } catch (err) {
    console.warn('Database query failed in AdminDashboard, using fallback statistics:', err)
  }

  const stats = [
    { 
      name: 'Showcase Instruments', 
      value: productCount, 
      desc: 'Active export catalog models',
      icon: Package, 
      color: 'text-amber-400', 
      bg: 'bg-amber-400/10 border-amber-400/20' 
    },
    { 
      name: 'Quote Inquiries (RFQ)', 
      value: quoteCount, 
      desc: `${pendingQuotes} pending action`,
      icon: MessageSquare, 
      color: 'text-sky-400', 
      bg: 'bg-sky-400/10 border-sky-400/20' 
    },
    { 
      name: 'Official Catalogues', 
      value: '5 Dossiers', 
      desc: 'Master + 4 Specialties',
      icon: FolderDown, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-400/10 border-emerald-400/20' 
    },
    { 
      name: 'Export Standards', 
      value: 'ISO 13485', 
      desc: 'CE & SCCI Compliant',
      icon: Layers, 
      color: 'text-purple-400', 
      bg: 'bg-purple-400/10 border-purple-400/20' 
    },
  ]

  return (
    <div className='space-y-8'>
      <Link href='/' className='inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors'>
        <ArrowLeft size={14} /> Back to Live Website
      </Link>

      {/* Welcome Banner */}
      <div className='p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1c38] to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <span className='px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30'>
              Sialkot B2B Export Hub
            </span>
            <span className='text-xs text-slate-400'>• SubMedOrtho Admin</span>
          </div>
          <h2 className='text-2xl lg:text-3xl font-bold text-white tracking-tight'>Control Center & Showcase Management</h2>
          <p className='text-slate-400 text-sm mt-1'>
            Manage export instrument listings, review incoming wholesale RFQ inquiries, and distribute technical catalogues.
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-3 shrink-0'>
          <Link 
            href='/admin/showcase' 
            className='px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-1.5'
          >
            Landing Hero Showcase
            <ArrowUpRight size={15} />
          </Link>
          <Link 
            href='/admin/featured' 
            className='px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-1.5'
          >
            Featured Product Videos
            <ArrowUpRight size={15} />
          </Link>
          <Link 
            href='/admin/products' 
            className='px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/10 flex items-center gap-1.5'
          >
            Manage Showcase
            <ArrowUpRight size={15} />
          </Link>
          <Link 
            href='/admin/quotes' 
            className='px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors'
          >
            Review RFQs
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat) => (
          <div key={stat.name} className='bg-[#0a1426] p-5 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between'>
            <div className='flex items-center justify-between mb-3'>
              <div className={`p-3 rounded-xl border ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <span className='text-[11px] font-bold text-slate-500 uppercase tracking-wider'>Status</span>
            </div>
            <div>
              <p className='text-xs text-slate-400 font-medium'>{stat.name}</p>
              <p className='text-2xl font-black text-white mt-0.5 tracking-tight'>{stat.value}</p>
              <p className='text-[11px] text-slate-400 mt-1 font-medium'>{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Recent Quote Requests */}
        <div className='bg-[#0a1426] rounded-2xl border border-slate-800/80 shadow-md overflow-hidden'>
          <div className='p-5 border-b border-slate-800 flex items-center justify-between'>
            <h3 className='font-bold text-white flex items-center gap-2 text-sm'>
              <MessageSquare size={18} className='text-sky-400' />
              Recent RFQ & Rate Inquiries
            </h3>
            <Link href='/admin/quotes' className='text-xs font-bold text-amber-400 hover:underline'>
              View All RFQs
            </Link>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead className='bg-slate-900/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]'>
                <tr>
                  <th className='px-5 py-3'>Product</th>
                  <th className='px-5 py-3'>Buyer</th>
                  <th className='px-5 py-3'>Qty</th>
                  <th className='px-5 py-3'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-800/60 text-slate-300'>
                {recentQuotes.length > 0 ? recentQuotes.map((q) => (
                  <tr key={q.id} className='hover:bg-slate-800/30 transition-colors'>
                    <td className='px-5 py-3.5 font-bold text-white truncate max-w-[160px]'>{q.productName}</td>
                    <td className='px-5 py-3.5'>
                      <p className='font-semibold text-slate-200'>{q.name}</p>
                      <p className='text-[10px] text-slate-400'>{q.email}</p>
                    </td>
                    <td className='px-5 py-3.5 font-mono text-amber-400 font-bold'>{q.qty} pcs</td>
                    <td className='px-5 py-3.5'>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                        q.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className='px-5 py-12 text-center text-slate-400'>
                      <MessageSquare size={28} className='mx-auto mb-2 opacity-40 text-slate-400' />
                      No recent quotes received yet. When buyers submit an RFQ on the site, they will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Featured Showcase Products */}
        <div className='bg-[#0a1426] rounded-2xl border border-slate-800/80 shadow-md overflow-hidden'>
          <div className='p-5 border-b border-slate-800 flex items-center justify-between'>
            <h3 className='font-bold text-white flex items-center gap-2 text-sm'>
              <Package size={18} className='text-amber-400' />
              Featured Showcase Instruments
            </h3>
            <Link href='/admin/products' className='text-xs font-bold text-amber-400 hover:underline'>
              Manage All ({productCount})
            </Link>
          </div>
          <div className='p-5 space-y-3'>
            {featuredProducts.map((product) => (
              <div key={product.id} className='flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors'>
                <div className='min-w-0 pr-3'>
                  <p className='font-bold text-white text-xs truncate'>{product.name}</p>
                  <p className='text-[10px] text-slate-400 mt-0.5'>{product.category} • SKU: {product.sku || 'SM-SPEC'}</p>
                </div>
                <div className='flex items-center gap-2 shrink-0'>
                  <span className='px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700'>
                    Inquire Rates
                  </span>
                  <Link 
                    href={`/product/${product.slug}`} 
                    target='_blank' 
                    className='p-1.5 text-slate-400 hover:text-amber-400 transition-colors'
                    title='View Live on Site'
                  >
                    <ExternalLink size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
