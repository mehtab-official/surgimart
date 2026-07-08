'use client'
import { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, GitCompare } from 'lucide-react'
import { useCartStore, useWishlistStore, useCompareStore, useCurrencyStore } from '@/store'
import { StarRating } from '@/components/ui/StarRating'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

const BADGE_STYLES: Record<string, string> = {
  NEW: 'bg-blue-600 text-white',
  SALE: 'bg-red-500 text-white',
  HOT: 'bg-orange-500 text-white',
  BULK: 'bg-purple-600 text-white',
}

export const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore(s => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const { addItem: addCompare, items: compareItems } = useCompareStore()
  const { convert, currency } = useCurrencyStore()

  const inWishlist = isInWishlist(product.id)
  const price = product.convertedPrice ?? convert(product.price)
  const oldPrice = product.oldPrice ? convert(product.oldPrice) : null

  function handleCompare() {
    if (compareItems.length >= 3) { toast.error('Max 3 products to compare'); return }
    addCompare(product)
    toast.success('Added to comparison')
  }

  return (
    <div data-testid='product-card' className='group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200'>
      {product.badge && (
        <span className={`absolute top-3 left-3 z-10 text-xs font-bold px-2 py-1 rounded-full ${BADGE_STYLES[product.badge]}`}>{product.badge}</span>
      )}
      <button onClick={() => toggleItem(product)} data-testid='wishlist-btn'
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={inWishlist}
        className='absolute top-3 right-3 z-10 p-1.5 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity'>
        <Heart size={16} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : '#94a3b8'} />
      </button>
      <Link href={`/product/${product.slug}`}>
        <div className='relative h-48 bg-slate-50'>
          {!product.inStock && (
            <div className='absolute inset-0 bg-white/70 z-10 flex items-center justify-center'>
              <span className='text-sm font-bold text-red-500'>Out of Stock</span>
            </div>
          )}
          <Image src={product.images?.[0] || '/placeholder.png'} alt={product.name} fill className='object-contain p-4 group-hover:scale-105 transition-transform duration-300' />
        </div>
      </Link>
      <div className='p-4 space-y-2'>
        <span className='text-xs font-bold text-blue-600 uppercase tracking-wide'>{product.category}</span>
        <Link href={`/product/${product.slug}`} data-testid='product-link'>
          <h3 className='text-sm font-semibold text-slate-900 line-clamp-2 hover:text-blue-600'>{product.name}</h3>
        </Link>
        <StarRating rating={product.rating} size="xs" />
        <div className="flex items-baseline gap-2">
          <span data-testid='product-price' className='font-lora font-bold text-slate-900'>{currency} {price.toFixed(2)}</span>
          {oldPrice && <span className='text-xs text-slate-400 line-through'>{currency} {oldPrice.toFixed(2)}</span>}
        </div>
        {product.moq && <p className='text-xs text-purple-600'>Bulk from {product.moq}+ units</p>}
        <div className='flex gap-2 pt-2'>
          <button onClick={() => { addToCart(product, 1); toast.success('Added to cart!') }}
            data-testid='add-to-cart' disabled={!product.inStock}
            className='flex-1 bg-blue-600 disabled:bg-slate-200 disabled:text-slate-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-700'>
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <button onClick={handleCompare} data-testid='compare-btn' aria-label='Add to comparison' className='p-2 border border-slate-200 rounded-lg hover:border-blue-400'>
            <GitCompare size={14} />
          </button>
        </div>
      </div>
    </div>
  )
})
