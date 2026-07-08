'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { useCompareStore, useCurrencyStore } from '@/store'
import { useHasMounted } from '@/hooks/useHasMounted'

export function ComparisonBar() {
  const { items, removeItem, clearAll } = useCompareStore()
  const { currency, convert } = useCurrencyStore()
  // L-12: Consistent useHasMounted usage
  const hasMounted = useHasMounted()

  if (!hasMounted) return null

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
          className='fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-600 shadow-2xl z-50 p-4'>
          <div className='max-w-5xl mx-auto flex items-center gap-4'>
            {[0, 1, 2].map(i => {
              const item = items[i]
              return item ? (
                <div key={item.id} className='flex-1 flex items-center gap-3 bg-slate-50 rounded-xl p-3 relative'>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from comparison`}
                    className='absolute top-1 right-1 text-slate-400 hover:text-red-500'
                  >
                    <X size={14} />
                  </button>
                  <div className='w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0'>
                    <Image src={item.images?.[0] || '/placeholder.png'} alt={item.name} width={48} height={48} className='object-contain' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium truncate'>{item.name}</p>
                    <p className='text-sm font-bold text-blue-600'>{currency} {convert(item.price).toFixed(2)}</p>
                  </div>
                </div>
              ) : (
                <div key={`empty-${i}`} className='flex-1 border-2 border-dashed border-slate-300 rounded-xl p-3 flex items-center justify-center h-16'>
                  <span className='text-slate-400 text-lg'>+</span>
                </div>
              )
            })}
            <div className='flex flex-col gap-2'>
              {/* M-10: Compare Now links to a comparison view with query params */}
              <Link
                href={`/shop?compare=${items.map(i => i.slug).join(',')}`}
                className={`bg-blue-600 text-white text-sm font-bold px-6 py-2 rounded-lg text-center ${items.length < 2 ? 'opacity-50 pointer-events-none' : 'hover:bg-blue-700'}`}
                aria-disabled={items.length < 2}
              >
                Compare Now
              </Link>
              <button onClick={clearAll} className='text-xs text-slate-500 hover:text-red-500'>Clear All</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
