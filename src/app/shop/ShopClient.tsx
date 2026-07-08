'use client'
import { useState, useMemo } from 'react'
import { ProductGrid } from '@/components/product/ProductGrid'
import type { Product } from '@/types'

const CATEGORIES = ['All', 'Surgical', 'Dental', 'Orthopedic', 'Veterinary', 'ENT', 'Ophthalmology']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'popular', label: 'Most Popular' },
]

interface ShopClientProps {
  initialProducts: Product[]
  initialCategory?: string
  initialQuery?: string
}

export function ShopClient({ initialProducts, initialCategory = 'All', initialQuery = '' }: ShopClientProps) {
  const [category, setCategory] = useState(initialCategory)
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState(initialQuery)

  const filtered = useMemo(() => {
    let pList = [...initialProducts]
    if (category !== 'All') {
      pList = pList.filter(p => p.category?.toLowerCase() === category.toLowerCase())
    }
    if (search) {
      pList = pList.filter(p => 
        p.name?.toLowerCase().includes(search.toLowerCase()) || 
        p.description?.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    switch (sort) {
      case 'price-asc': pList.sort((a, b) => (a.price || 0) - (b.price || 0)); break
      case 'price-desc': pList.sort((a, b) => (b.price || 0) - (a.price || 0)); break
      case 'popular': pList.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break
    }
    return pList
  }, [category, sort, search, initialProducts])

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <h1 className='font-lora text-3xl font-bold mb-6'>Shop Instruments</h1>
      
      <div className='flex flex-col md:flex-row gap-4 mb-8'>
        <div className='flex flex-wrap gap-2'>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategory(cat)}
              data-testid={`category-filter-${cat.toLowerCase()}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className='flex gap-3 ml-auto'>
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder='Search instruments...'
            className='border rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/20' 
          />
          <select 
            value={sort} 
            onChange={e => setSort(e.target.value)} 
            className='border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20'
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <ProductGrid products={filtered} />
      ) : (
        <div className='text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200'>
          <p className='text-slate-500 text-lg'>No products found matching your criteria.</p>
          <button 
            onClick={() => { setCategory('All'); setSearch(''); }}
            className='mt-4 text-blue-600 font-medium hover:underline'
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
