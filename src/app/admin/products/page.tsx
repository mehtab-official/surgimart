import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Edit2, ExternalLink, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { ProductTableActions } from '@/components/admin/ProductTableActions'

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

  const where = {
    AND: [
      query ? { name: { contains: query, mode: 'insensitive' as const } } : {},
      category ? { category } : {},
    ]
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-slate-800'>Products</h2>
          <p className='text-slate-500'>Manage your surgical instruments inventory.</p>
        </div>
        <Link 
          href='/admin/products/new' 
          className='bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors'
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      {/* Filters/Search */}
      <div className='bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-4 items-center'>
        <div className='relative flex-1 min-w-[300px]'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
          <input 
            type='text' 
            placeholder='Search products by name or SKU...' 
            defaultValue={query}
            className='w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
          />
        </div>
        <select 
          defaultValue={category}
          className='px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
        >
          <option value=''>All Categories</option>
          {/* We'll populate this later or keep it static if needed */}
        </select>
      </div>

      <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='bg-slate-50 text-slate-500 font-medium'>
              <tr>
                <th className='px-6 py-4'>Product</th>
                <th className='px-6 py-4'>Category</th>
                <th className='px-6 py-4'>Price</th>
                <th className='px-6 py-4'>Stock</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {products.map((product) => (
                <tr key={product.id} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200'>
                        {product.images[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className='object-cover' />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-slate-400'>
                            <Package size={20} />
                          </div>
                        )}
                      </div>
                      <div className='min-w-0'>
                        <p className='font-bold text-slate-800 truncate'>{product.name}</p>
                        <p className='text-[10px] text-slate-500 font-bold uppercase'>SKU: {product.sku || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='px-2 py-1 rounded-md bg-slate-100 text-slate-600 font-medium text-xs'>
                      {product.category}
                    </span>
                  </td>
                  <td className='px-6 py-4 font-bold text-blue-600'>
                    {formatCurrency(product.price, 'USD')}
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex flex-col'>
                      <span className={`font-bold ${product.stockCount <= 10 ? 'text-amber-500' : 'text-slate-700'}`}>
                        {product.stockCount}
                      </span>
                      <span className='text-[10px] text-slate-400 font-bold uppercase'>units</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      product.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {product.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Link 
                        href={`/product/${product.slug}`} 
                        target='_blank' 
                        className='p-2 text-slate-400 hover:text-blue-600 transition-colors'
                        title='View on Shop'
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <Link 
                        href={`/admin/products/${product.id}/edit`} 
                        className='p-2 text-slate-400 hover:text-amber-600 transition-colors'
                        title='Edit Product'
                      >
                        <Edit2 size={18} />
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
          <div className='p-6 border-t border-slate-100 flex items-center justify-between'>
            <p className='text-sm text-slate-500'>
              Showing <span className='font-bold'>{(page - 1) * limit + 1}</span> to <span className='font-bold'>{Math.min(page * limit, total)}</span> of <span className='font-bold'>{total}</span> products
            </p>
            <div className='flex items-center gap-2'>
              {/* Simple pagination buttons */}
              <Link 
                href={`/admin/products?page=${page - 1}${query ? `&q=${query}` : ''}`}
                className={`px-4 py-2 text-sm font-bold rounded-lg border border-slate-200 transition-colors ${
                  page <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-slate-50'
                }`}
              >
                Previous
              </Link>
              <Link 
                href={`/admin/products?page=${page + 1}${query ? `&q=${query}` : ''}`}
                className={`px-4 py-2 text-sm font-bold rounded-lg border border-slate-100 transition-colors bg-blue-600 text-white hover:bg-blue-700 ${
                  page >= totalPages ? 'pointer-events-none opacity-50' : ''
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
