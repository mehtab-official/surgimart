import type { Metadata } from 'next'
import { getProductBySlug, getRelatedProducts } from '@/lib/products'
import { ProductDetailClient } from './client'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.name,
    description: product.description?.slice(0, 160) || `Buy ${product.name} from Submed Ortho`,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [product, related] = await Promise.all([
    getProductBySlug(slug),
    getRelatedProducts(slug),
  ])

  if (!product) {
    return (
      <div className='max-w-7xl mx-auto px-4 py-20 text-center'>
        <h1 className='text-2xl font-bold'>Product Not Found</h1>
        <p className='text-slate-500 mt-2'>This product may have been removed or the URL is incorrect.</p>
      </div>
    )
  }

  return <ProductDetailClient product={product} related={related || []} />
}
