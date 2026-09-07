'use client'

import { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, GitCompare, FileText, Send, Phone, ShieldCheck } from 'lucide-react'
import { useWishlistStore, useCompareStore } from '@/store'
import { StarRating } from '@/components/ui/StarRating'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

const BADGE_STYLES: Record<string, string> = {
  NEW: 'bg-blue-600 text-white',
  SALE: 'bg-emerald-600 text-white',
  HOT: 'bg-orange-500 text-white',
  BULK: 'bg-purple-600 text-white',
}

export const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const { toggleItem, isInWishlist } = useWishlistStore()
  const { addItem: addCompare, items: compareItems } = useCompareStore()

  const inWishlist = isInWishlist(product.id)

  function handleCompare() {
    if (compareItems.length >= 3) { toast.error('Max 3 products to compare'); return }
    addCompare(product)
    toast.success('Added to comparison')
  }

  return (
    <div data-testid='product-card' className='group relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between'>
      
      {/* Top Badges */}
      <div>
        {product.badge && (
          <span className={`absolute top-3 left-3 z-10 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${BADGE_STYLES[product.badge] || 'bg-blue-600 text-white'}`}>
            {product.badge}
          </span>
        )}
        
        <button 
          onClick={() => toggleItem(product)} 
          data-testid='wishlist-btn'
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={inWishlist}
          className='absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white'
        >
          <Heart size={15} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : '#94a3b8'} />
        </button>

        {/* Product Image */}
        <Link href={`/product/${product.slug}`}>
          <div className='relative h-52 bg-slate-50 overflow-hidden flex items-center justify-center'>
            <Image 
              src={product.images?.[0] || '/uploads/products/Forceps.png'} 
              alt={product.name} 
              fill 
              className='object-contain p-5 group-hover:scale-105 transition-transform duration-300' 
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className='p-4 space-y-2'>
          
          <div className='flex items-center justify-between'>
            <span className='text-[10px] font-extrabold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded'>
              {product.category}
            </span>
            {product.sku && (
              <span className='text-[10px] text-slate-400 font-mono'>
                SKU: {product.sku}
              </span>
            )}
          </div>

          <Link href={`/product/${product.slug}`} data-testid='product-link'>
            <h3 className='text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors leading-snug'>
              {product.name}
            </h3>
          </Link>

          <StarRating rating={product.rating} size="xs" />

          {/* Showcase Status / Rate Notice */}
          <div className='pt-1'>
            <div className='flex items-center gap-1.5 text-xs text-slate-700 font-semibold'>
              <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
              <span>Direct Export & Wholesale Inquiry</span>
            </div>
            <p className='text-[11px] text-slate-500 mt-0.5'>
              Contact for bulk hospital rates & OEM specs
            </p>
          </div>

        </div>
      </div>

      {/* Action Buttons: Request Quote & Details */}
      <div className='p-4 pt-0 space-y-2'>
        <div className='flex gap-2 pt-2 border-t border-slate-100'>
          
          <Link
            href={`/quote?product=${encodeURIComponent(product.name)}&sku=${encodeURIComponent(product.sku || '')}`}
            className='flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm'
          >
            <FileText size={13} />
            <span>Inquire Rates</span>
          </Link>

          <Link
            href={`/product/${product.slug}`}
            className='bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center'
          >
            <span>Specs</span>
          </Link>

        </div>
      </div>

    </div>
  )
})
