'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingCart } from 'lucide-react'
import { useWishlistStore, useCartStore, useCurrencyStore } from '@/store'
import { useHasMounted } from '@/hooks/useHasMounted'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const addToCart = useCartStore(s => s.addItem)
  const { convert, currency } = useCurrencyStore()
  const hasMounted = useHasMounted()

  if (!hasMounted) return null

  return (
    <section className='max-w-7xl mx-auto px-4 py-16'>
      <h1 className='font-lora text-3xl font-bold mb-8'>Wishlist ({items.length})</h1>
      {items.length === 0 ? (
        <div className='text-center py-20'>
          <p className='text-slate-500 text-lg mb-4'>Your wishlist is empty</p>
          <Link href='/shop' className='bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700'>Shop Now</Link>
        </div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {items.map(item => (
            <div key={item.id} className='border border-slate-100 rounded-2xl overflow-hidden'>
              <Link href={`/product/${item.slug}`}>
                <div className='relative h-48 bg-slate-50'>
                  <Image src={item.image || '/placeholder.png'} alt={item.name} fill className='object-contain p-4' />
                </div>
              </Link>
              <div className='p-4 space-y-2'>
                <h3 className='text-sm font-semibold truncate'>{item.name}</h3>
                <p className='font-lora font-bold'>{currency} {convert(item.price).toFixed(2)}</p>
                <div className='flex gap-2'>
                  <button onClick={() => { addToCart({ id: item.id, name: item.name, price: item.price, images: [{ url: item.image }], slug: item.slug, category: '', inStock: true, rating: 0, reviewCount: 0 } as unknown as Product, 1); toast.success('Added to cart') }}
                    className='flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1'>
                    <ShoppingCart size={12}/> Add to Cart
                  </button>
                  <button onClick={() => removeItem(item.id)} className='p-2 border rounded-lg text-red-400 hover:text-red-600'>
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
