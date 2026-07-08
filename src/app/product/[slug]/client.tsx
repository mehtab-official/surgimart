'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Minus, Plus, ShoppingCart, ZoomIn, FileText } from 'lucide-react'
import { StarRating } from '@/components/ui/StarRating'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ZoomModal } from '@/components/product/ZoomModal'
import { QuoteModal } from '@/components/product/QuoteModal'
import { useCartStore, useCurrencyStore, useRecentlyViewedStore } from '@/store'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

interface Props { product: Product; related: Product[] }

export function ProductDetailClient({ product, related }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<'desc'|'specs'|'reviews'>('desc')
  const [zoomOpen, setZoomOpen] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const addToCart = useCartStore(s => s.addItem)
  const { convert, currency } = useCurrencyStore()
  const addRecent = useRecentlyViewedStore(s => s.addItem)

  useEffect(() => { addRecent(product) }, [product, addRecent])

  const price = convert(product.price)
  const oldPrice = product.oldPrice ? convert(product.oldPrice) : null
  const currentImage = product.images?.[selectedImage] || '/placeholder.png'

  return (
    <section className='max-w-7xl mx-auto px-4 py-8'>
      <div className='grid md:grid-cols-2 gap-12'>
        <div>
          <div className='relative bg-slate-50 rounded-2xl overflow-hidden h-96 mb-4 cursor-zoom-in' 
            data-testid='product-image'
            onClick={() => setZoomOpen(true)}>
            <Image src={currentImage} alt={product.name} fill className='object-contain p-8' />
            <button className='absolute bottom-4 right-4 bg-white p-2 rounded-full shadow'><ZoomIn size={18}/></button>
          </div>
          <div className='flex gap-2 overflow-x-auto'>
            {product.images?.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 ${i === selectedImage ? 'border-blue-600' : 'border-transparent'}`}>
                <Image src={img} alt='' width={64} height={64} className='object-contain p-1' />
              </button>
            ))}
          </div>
        </div>
        <div className='space-y-4'>
          <span className='text-xs font-bold text-blue-600 uppercase tracking-wide'>{product.category}</span>
          <h1 data-testid='product-name' className='font-lora text-3xl font-bold text-slate-900'>{product.name}</h1>
          <div className='flex items-center gap-2'>
            <StarRating rating={product.rating} />
            <span className='text-sm text-slate-500'>({product.reviewCount} reviews)</span>
          </div>
          <div className='flex items-baseline gap-3'>
            <span data-testid='product-price' className='font-lora text-3xl font-bold text-slate-900'>{currency} {price.toFixed(2)}</span>
            {oldPrice && <span className='text-lg text-slate-400 line-through'>{currency} {oldPrice.toFixed(2)}</span>}
          </div>
          {product.badge && <span className='inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full'>{product.badge}</span>}
          <p className={`text-sm font-bold ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
            {product.inStock ? `In Stock (${product.stockCount || 'Available'})` : 'Out of Stock'}
          </p>
          <div className='flex items-center gap-4'>
            <div className='flex items-center border rounded-xl overflow-hidden'>
              <button onClick={() => setQty(q => Math.max(1, q-1))} className='px-3 py-2 hover:bg-slate-100'><Minus size={16}/></button>
              <span className='px-4 py-2 border-x font-bold'>{qty}</span>
              <button onClick={() => setQty(q => q+1)} className='px-3 py-2 hover:bg-slate-100'><Plus size={16}/></button>
            </div>
            <button data-testid='add-to-cart' disabled={!product.inStock}
              onClick={() => { addToCart(product, qty); toast.success('Added to cart!') }}
              className='flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2'>
              <ShoppingCart size={18}/> Add to Cart
            </button>
          </div>
          {product.moq && (
            <button data-testid='get-quote-btn' onClick={() => setQuoteOpen(true)} className='w-full border-2 border-purple-600 text-purple-600 font-bold py-3 rounded-xl hover:bg-purple-50 flex items-center justify-center gap-2'>
              <FileText size={18}/> Request Bulk Quote ({product.moq}+ units)
            </button>
          )}
        </div>
      </div>
      <div className='mt-12'>
        <div className='flex gap-6 border-b'>
          {(['desc','specs','reviews'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-3 text-sm font-bold capitalize ${tab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>
              {t === 'desc' ? 'Description' : t === 'specs' ? 'Specifications' : `Reviews (${product.reviewCount})`}
            </button>
          ))}
        </div>
        <div className='py-6'>
          {tab === 'desc' && <p className='text-slate-700 leading-relaxed'>{product.description || 'No description available.'}</p>}
          {tab === 'specs' && (
            <table className='w-full text-sm'>
              <tbody>
                {product.specifications?.map((s, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : ''}>
                    <td className='py-2 px-4 font-medium text-slate-600'>{s.key}</td>
                    <td className='py-2 px-4'>{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === 'reviews' && (
            <div className='space-y-4'>
              {product.reviews?.map(r => (
                <div key={r.id} className='border-b pb-4'>
                  <div className='flex items-center gap-2 mb-1'>
                    <StarRating rating={r.rating} size='xs' />
                    {r.verified && <span className='text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full'>Verified</span>}
                  </div>
                  <p className='font-bold text-sm'>{r.title}</p>
                  <p className='text-sm text-slate-600'>{r.body}</p>
                  <p className='text-xs text-slate-400 mt-1'>{r.customerName}, {r.country}</p>
                </div>
              ))}
              {(!product.reviews || product.reviews.length === 0) && <p className='text-slate-500'>No reviews yet.</p>}
            </div>
          )}
        </div>
      </div>
      {related.length > 0 && (
        <div className='mt-12'>
          <h2 className='font-lora text-2xl font-bold mb-6'>Related Products</h2>
          <ProductGrid products={related} columns={4} />
        </div>
      )}
      <ZoomModal src={currentImage} alt={product.name} open={zoomOpen} onClose={() => setZoomOpen(false)} />
      <QuoteModal product={product} open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </section>
  )
}
