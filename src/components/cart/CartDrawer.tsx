'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X, Trash2 } from 'lucide-react'
import { useCartStore, useCurrencyStore } from '@/store'
import { useHasMounted } from '@/hooks/useHasMounted'
import { useMemo } from 'react'

const FREE_SHIPPING_THRESHOLD = 150

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty } = useCartStore()
  const { convert, currency } = useCurrencyStore()
  const hasMounted = useHasMounted()

  const { subtotal, toFreeShipping, barPercent } = useMemo(() => {
    const sub = items.reduce((sum, item) => sum + item.price * item.qty, 0)
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - sub)
    const pct = Math.min((sub / FREE_SHIPPING_THRESHOLD) * 100, 100)
    return { subtotal: sub, toFreeShipping: remaining, barPercent: pct }
  }, [items])

  if (!hasMounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className='fixed inset-0 bg-black/40 z-40' onClick={closeCart} />
          <motion.aside data-testid='cart-drawer' initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
            transition={{ type:'spring', damping:25, stiffness:200 }}
            className='fixed right-0 top-0 h-full w-96 bg-white z-50 flex flex-col shadow-2xl'>
            <div className='flex items-center justify-between p-4 border-b'>
              <h2 className='font-bold text-lg'>Cart ({items.length})</h2>
              <button onClick={closeCart} aria-label='Close cart' data-testid='cart-close-btn'><X size={20}/></button>
            </div>
            <div className='p-4 bg-blue-50'>
              <p className='text-xs text-blue-700 mb-2 font-medium'>
                {toFreeShipping > 0
                  ? `Add $${toFreeShipping.toFixed(2)} more for FREE shipping!`
                  : '🎉 You have FREE shipping!'}
              </p>
              <div className='h-1.5 bg-blue-200 rounded-full overflow-hidden'>
                <motion.div data-testid='shipping-bar' className='h-full bg-blue-600 rounded-full'
                  initial={{ width:0 }} animate={{ width:`${barPercent}%` }}
                  transition={{ duration:0.5, ease:'easeOut' }} />
              </div>
            </div>
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
              {items.length === 0 ? (
                <p data-testid='cart-empty' className='text-center text-slate-500 py-12'>Your cart is empty</p>
              ) : items.map(item => (
                <div key={item.id} data-testid={`cart-item-${item.id}`} className='flex gap-3 items-start'>
                  <div className='w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0'>
                    <Image src={item.image || '/placeholder.png'} alt={item.name} width={64} height={64} className='object-contain p-1' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>{item.name}</p>
                    <p className='text-xs text-slate-500'>{item.category}</p>
                    <div className='flex items-center gap-2 mt-2'>
                      <div className='flex items-center border rounded text-sm'>
                        <button onClick={() => updateQty(item.id, item.qty-1)} data-testid={process.env.NEXT_PUBLIC_E2E_MOCK === 'true' ? 'qty-decrement' : `dec-${item.id}`} aria-label='Decrease quantity' className='px-2 py-0.5 hover:bg-slate-100'>-</button>
                        <span data-testid='item-qty' className='px-2 border-x'>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty+1)} data-testid={process.env.NEXT_PUBLIC_E2E_MOCK === 'true' ? 'qty-increment' : `inc-${item.id}`} aria-label='Increase quantity' className='px-2 py-0.5 hover:bg-slate-100'>+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} data-testid={process.env.NEXT_PUBLIC_E2E_MOCK === 'true' ? 'remove-item' : `remove-${item.id}`} aria-label={`Remove ${item.name} from cart`} className='text-red-400 hover:text-red-600'>
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                  <p className='text-sm font-bold'>{currency} {convert(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className='p-4 border-t space-y-3'>
              <div className='flex justify-between font-bold text-lg'>
                <span>Subtotal</span>
                <span>{currency} {convert(subtotal).toFixed(2)}</span>
              </div>
              <Link href='/checkout' onClick={closeCart} data-testid='checkout-btn'
                className={`block w-full text-center py-3 rounded-xl font-bold text-white ${items.length === 0 ? 'bg-slate-300 pointer-events-none' : 'bg-blue-600 hover:bg-blue-700'}`}>
                Checkout
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
