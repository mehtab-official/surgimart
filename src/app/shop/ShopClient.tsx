'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductGrid } from '@/components/product/ProductGrid'
import type { Product } from '@/types'

const CATEGORIES = [
  { id: 'All', label: 'All Products' },
  { id: 'Surgical', label: 'General Surgery' },
  { id: 'Orthopedic', label: 'Orthopaedic' },
  { id: 'ENT', label: 'ENT Specialty' },
  { id: 'Neuro-Spinal', label: 'Neuro / Spinal' },
  { id: 'Implants', label: 'Implants & Plates' },
  { id: 'Dental', label: 'Dental' },
  { id: 'Veterinary', label: 'Veterinary' },
  { id: 'Ophthalmology', label: 'Ophthalmology' },
]

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Inquired / Popular' },
  { value: 'newest', label: 'Newest Showcase Additions' },
]

interface ShopClientProps {
  initialProducts: Product[]
  initialCategory?: string
  initialQuery?: string
}

function normalize(str?: string | null): string {
  if (!str) return ''
  const s = str.toLowerCase().replace(/[-_\s]/g, '')
  if (s.includes('general') || s.includes('surg')) return 'surgical'
  if (s.includes('ortho')) return 'orthopedic'
  if (s.includes('dent')) return 'dental'
  if (s.includes('vet')) return 'veterinary'
  if (s.includes('ent')) return 'ent'
  if (s.includes('neuro') || s.includes('spin')) return 'neuro-spinal'
  if (s.includes('implant') || s.includes('plat')) return 'implants'
  if (s.includes('ophth')) return 'ophthalmology'
  return s
}

export function ShopClient({ initialProducts, initialCategory = 'All', initialQuery = '' }: ShopClientProps) {
  // Resolve initial category match
  const matchedInitial = useMemo(() => {
    if (!initialCategory || initialCategory.toLowerCase() === 'all') return 'All'
    const norm = normalize(initialCategory)
    const found = CATEGORIES.find(c => normalize(c.id) === norm)
    return found ? found.id : 'All'
  }, [initialCategory])

  const [category, setCategory] = useState(matchedInitial)
  const [sort, setSort] = useState('popular')
  const [search, setSearch] = useState(initialQuery)

  const filtered = useMemo(() => {
    let pList = [...initialProducts]
    
    if (category !== 'All') {
      const target = normalize(category)
      const matched = pList.filter(p => normalize(p.category) === target)
      // If category has products, filter by it; otherwise show all rather than empty screen
      if (matched.length > 0) {
        pList = matched
      }
    }
    
    if (search.trim()) {
      const q = search.toLowerCase()
      const searchMatched = pList.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
      if (searchMatched.length > 0) {
        pList = searchMatched
      }
    }
    
    switch (sort) {
      case 'price-asc': pList.sort((a, b) => (a.price || 0) - (b.price || 0)); break
      case 'price-desc': pList.sort((a, b) => (b.price || 0) - (a.price || 0)); break
      case 'popular': pList.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break
    }
    return pList
  }, [category, sort, search, initialProducts])

  // Background slideshow for Shop Header Banner
  const [bannerSlide, setBannerSlide] = useState(0)
  const BANNER_SLIDES = [
    {
      image: '/images/products-hero-1.jpg',
      alt: 'Operating Room Precision Surgical Trays & Forceps'
    },
    {
      image: '/images/products-hero-2.jpg',
      alt: 'Titanium Orthopedic Trauma Plates & Fixation Screws'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerSlide(prev => (prev + 1) % BANNER_SLIDES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
      
      {/* Back Button */}
      <div className='mb-6'>
        <Link 
          href='/'
          className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-sm'
        >
          ← Back to Home
        </Link>
      </div>

      {/* Hero Banner with Dynamic Background Slideshow */}
      <div className='relative rounded-3xl overflow-hidden bg-slate-950 text-white p-8 sm:p-12 mb-10 border border-slate-800 shadow-2xl group'>
        {/* Animated Background Slideshow */}
        <div className='absolute inset-0 z-0 overflow-hidden pointer-events-none'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={bannerSlide}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className='absolute inset-0 w-full h-full'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={BANNER_SLIDES[bannerSlide].image} 
                alt={BANNER_SLIDES[bannerSlide].alt} 
                className='w-full h-full object-cover object-center filter brightness-[0.45] contrast-125 saturate-110'
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradients for high contrast legibility */}
          <div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/40' />
          <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent' />
        </div>

        {/* Content Container */}
        <div className='relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6'>
          <div className='max-w-2xl space-y-4'>
            <div className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30 backdrop-blur-sm'>
              <span>Quality You Can Trust • 15+ Years Sialkot Hub</span>
            </div>
            <h1 className='text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight'>
              Medical & Dental <br />
              <span className='bg-gradient-to-r from-blue-400 to-sky-200 bg-clip-text text-transparent'>
                Showcase Catalog
              </span>
            </h1>
            <p className='text-sm sm:text-base text-slate-300 font-normal leading-relaxed'>
              Complete range of surgical, orthopedic, dental, and ENT instruments — manufactured to the highest international ISO 13485 standards. Select any instrument to view specifications or inquire wholesale rates.
            </p>
            <div className='flex flex-wrap gap-4 pt-2 text-xs font-semibold text-slate-300'>
              <span className='flex items-center gap-1.5'>✓ AISI 410/420 German Stainless Steel</span>
              <span className='flex items-center gap-1.5'>✓ 100% Passivation & Autoclavable</span>
              <span className='flex items-center gap-1.5'>✓ Worldwide B2B Export Logistics</span>
            </div>
          </div>

          {/* Slideshow Indicator Dots */}
          <div className='flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm shrink-0 self-start md:self-auto'>
            {BANNER_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setBannerSlide(i)}
                aria-label={`Switch to banner slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  bannerSlide === i ? 'w-6 bg-blue-500' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Category Pills & Filters */}
      <div className='flex flex-col lg:flex-row gap-4 mb-8 items-start lg:items-center justify-between'>
        <div className='flex flex-wrap gap-2'>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setCategory(cat.id)}
              data-testid={`category-filter-${cat.id.toLowerCase()}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                category === cat.id 
                  ? 'bg-blue-600 text-white shadow-blue-600/20' 
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        <div className='flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto shrink-0'>
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder='Search by instrument name or SKU...'
            className='bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm' 
          />
          <select 
            value={sort} 
            onChange={e => setSort(e.target.value)} 
            className='bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm cursor-pointer'
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid products={filtered} columns={4} />

    </div>
  )
}
