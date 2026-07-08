'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import Image from 'next/image'
import { searchProducts } from '@/app/actions/search'
import { useDebounce } from '@/hooks/useDebounce'
import { useCurrencyStore } from '@/store'
import type { AlgoliaResult } from '@/types'

export function SearchAutocomplete() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AlgoliaResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { convert, currency } = useCurrencyStore()

  const debouncedQuery = useDebounce(query, 250)

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults([]); setOpen(false); return
    }
    setLoading(true)
    searchProducts(debouncedQuery, 6).then(hits => {
      setResults(hits); setOpen(true); setLoading(false)
    })
  }, [debouncedQuery])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={containerRef} className='relative w-full'>
      <div className='flex items-center bg-white border border-slate-300 rounded-xl px-3 py-2 gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'>
        <Search size={16} className="text-slate-400" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={e => { if (e.key === 'Escape') setOpen(false) }}
          data-testid='search-input'
          placeholder='Search surgical instruments...' className='flex-1 text-sm outline-none bg-white text-slate-800 placeholder-slate-400' />
      </div>
      {open && (
        <div data-testid='search-dropdown' className='absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden'>
          {loading ? (
            [...Array(3)].map((_,i) => (
              <div key={i} className='flex gap-3 p-3 animate-pulse'>
                <div className='w-10 h-10 bg-slate-200 rounded' />
                <div className='flex-1 space-y-2'>
                  <div className='h-3 bg-slate-200 rounded w-2/3' />
                  <div className='h-3 bg-slate-200 rounded w-1/3' />
                </div>
              </div>
            ))
          ) : results.map(hit => (
            <button key={hit.objectID} data-testid='search-result' onClick={() => { router.push(`/product/${hit.slug}`); setOpen(false) }}
              className='w-full flex items-center gap-3 p-3 hover:bg-blue-50 text-left'>
              <div className='w-10 h-10 bg-slate-100 rounded overflow-hidden shrink-0'>
                <Image src={hit.image || '/placeholder.png'} alt={hit.name} width={40} height={40} className='object-contain' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>{hit.name}</p>
                <span className='text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full'>{hit.category}</span>
              </div>
              <span className='text-sm font-bold text-slate-900'>{currency} {convert(hit.price).toFixed(2)}</span>
            </button>
          ))}
          <button onClick={() => router.push(`/shop?q=${query}`)}
            className='w-full p-3 text-sm text-blue-600 font-medium hover:bg-blue-50 border-t'>
            Search for &quot;{query}&quot; &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
