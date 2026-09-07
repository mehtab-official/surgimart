import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Edit2, ExternalLink, Package, ArrowLeft } from 'lucide-react'
import { ProductTableActions } from '@/components/admin/ProductTableActions'
import { FALLBACK_PRODUCTS } from '@/lib/products'

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; category?: string }>
}) {
  const sp = await searchParams
  const query = sp.q || ''
  const category = sp.category || ''
  const page = parseInt(sp.page || '1')
  const limit = 10
  const skip = (page - 1) * limit

  let products: any[] = []
  let total = 0

  try {
    const where = {
      AND: [
        query ? { name: { contains: query, mode: 'insensitive' as const } } : {},
        category ? { category } : {},
      ]
    }

    const [dbProducts, dbTotal] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts
      total = dbTotal
    } else {
      throw new Error('No DB products found, using fallback catalog')
    }
  } catch (err) {
    console.warn('Prisma DB query in AdminProductsPage fell back to FALLBACK_PRODUCTS:', err)
    let filtered = FALLBACK_PRODUCTS
    if (query) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku?.toLowerCase().includes(query.toLowerCase()))
    }
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase())
    }
    total = filtered.length
    products = filtered.slice(skip, skip + limit)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className='space-y-6'>
      <Link href='/admin' className='inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors'>
        <ArrowLeft size={14} /> Back to Overview
      </Link>

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <span className='px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30'>
              B2B Showcase Catalog
            </span>
            <span className='text-xs text-slate-400'>• {total} Total Instruments</span>
          </div>
          <h2 className='text-2xl font-bold text-white tracking-tight'>Showcase Products</h2>
          <p className='text-slate-400 text-sm'>Manage instrument specifications, showcase status, and export catalog items.</p>
        </div>
        <Link 
          href='/admin/products/new' 
          className='bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm shadow-lg shadow-amber-500/10'
        >
          <Plus size={18} />
          Add Instrument
        </Link>
      </div>

      {/* Filters/Search */}
      <div className='bg-[#0a1426] p-4 rounded-2xl border border-slate-800/80 flex flex-wrap gap-4 items-center shadow-md'>
        <div className='relative flex-1 min-w-[280px]'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500' size={17} />
          <form method='GET' action='/admin/products'>
            <input 
              name='q'
              type='text' 
              placeholder='Search by instrument name or SKU...' 
              defaultValue={query}
              className='w-full pl-10 pr-4 py-2 bg-slate-900/80 text-white placeholder:text-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400 text-sm'
            />
          </form>
        </div>
        <Link 
          href='/shop' 
          target='_blank'
          className='text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800'
        >
          <ExternalLink size={14} />
          View Live Showcase
        </Link>
      </div>

      <div className='bg-[#0a1426] rounded-2xl border border-slate-800/80 shadow-md overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='bg-slate-900/70 text-slate-400 font-bold uppercase tracking-wider text-[10px]'>
              <tr>
                <th className='px-6 py-4'>Instrument</th>
                <th className='px-6 py-4'>Category</th>
                <th className='px-6 py-4'>Rate Model</th>
                <th className='px-6 py-4'>Batch Stock</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60 text-slate-300'>
              {products.map((product) => (
                <tr key={product.id} className='hover:bg-slate-800/30 transition-colors'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3.5'>
                      <div className='w-12 h-12 rounded-xl bg-slate-900 overflow-hidden relative border border-slate-800 shrink-0 p-1 flex items-center justify-center'>
                        {product.images && product.images[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className='object-contain p-1' />
                        ) : (
                          <Package size={20} className='text-slate-500' />
                        )}
                      </div>
                      <div className='min-w-0 max-w-[280px]'>
                        <p className='font-bold text-white truncate text-sm'>{product.name}</p>
                        <p className='text-[10px] text-amber-400/80 font-mono font-bold uppercase tracking-wider mt-0.5'>SKU: {product.sku || 'SM-SPEC'}</p>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/60 font-medium text-xs'>
                      {product.category}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30'>
                      Inquire Rates / RFQ
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex flex-col'>
                      <span className='font-bold text-slate-200 font-mono text-xs'>
                        {product.stockCount || 500}
                      </span>
                      <span className='text-[9px] text-slate-400 font-bold uppercase tracking-wider'>Export units</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      product.isPublished !== false ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {product.isPublished !== false ? 'Showcased' : 'Draft'}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <Link 
                        href={`/product/${product.slug}`} 
                        target='_blank' 
                        className='p-2 text-slate-400 hover:text-amber-400 transition-colors'
                        title='View on Showcase'
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <Link 
                        href={`/admin/products/${product.id}/edit`} 
                        className='p-2 text-slate-400 hover:text-sky-400 transition-colors'
                        title='Edit Specs'
                      >
                        <Edit2 size={16} />
                      </Link>
                      <ProductTableActions productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='p-5 border-t border-slate-800/80 flex items-center justify-between text-xs'>
            <p className='text-slate-400'>
              Showing <span className='font-bold text-white'>{(page - 1) * limit + 1}</span> to <span className='font-bold text-white'>{Math.min(page * limit, total)}</span> of <span className='font-bold text-white'>{total}</span> instruments
            </p>
            <div className='flex items-center gap-2'>
              <Link 
                href={`/admin/products?page=${page - 1}${query ? `&q=${query}` : ''}`}
                className={`px-3.5 py-1.5 rounded-lg border border-slate-800 text-slate-300 transition-colors ${
                  page <= 1 ? 'pointer-events-none opacity-40' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                Previous
              </Link>
              <Link 
                href={`/admin/products?page=${page + 1}${query ? `&q=${query}` : ''}`}
                className={`px-3.5 py-1.5 rounded-lg border border-slate-800 text-slate-300 transition-colors ${
                  page >= totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-slate-800 hover:text-white'
                }`}
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
