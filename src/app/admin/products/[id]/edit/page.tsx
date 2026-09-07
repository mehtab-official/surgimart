import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { ProductForm } from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'
import { FALLBACK_PRODUCTS } from '@/lib/products'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  let product: any = null
  try {
    product = await prisma.product.findUnique({
      where: { id }
    })
  } catch (err) {
    console.warn('Prisma DB query failed in EditProductPage:', err)
  }

  if (!product) {
    product = FALLBACK_PRODUCTS.find(p => p.id === id || p.slug === id) || null
  }

  if (!product) notFound()

  return (
    <div className='space-y-6 max-w-4xl'>
      <Link href='/admin/products' className='inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors'>
        <ArrowLeft size={14} /> Back to Instruments
      </Link>

      <div>
        <h2 className='text-2xl font-bold text-white tracking-tight'>Edit Instrument Specification</h2>
        <p className='text-slate-400 text-sm'>Update specifications for {product.name}.</p>
      </div>

      <div className='bg-[#0a1426] p-6 rounded-2xl border border-slate-800/80 shadow-md text-slate-200'>
        <ProductForm initialData={product} productId={product.id} />
      </div>
    </div>
  )
}
