import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { Product } from '@prisma/client'
import { ProductForm } from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id }
  }) as Product | null

  if (!product) notFound()

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-slate-800'>Edit Product</h2>
        <p className='text-slate-500'>Update {product.name} information.</p>
      </div>

      <ProductForm initialData={product} productId={product.id} />
    </div>
  )
}
