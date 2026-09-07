'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Sparkles, Send, ShieldCheck, ArrowRight, Video, ChevronLeft, ChevronRight, Pause } from 'lucide-react'

import { DEFAULT_FEATURED_PRODUCTS, type FeaturedProductItem } from '@/types'

const BACKGROUND_SLIDES = [
  {
    image: '/images/products-hero-1.jpg',
    title: 'Operating Theater Precision Surgical Sets & Forceps',
    label: 'Precision Dissection & Clamping Systems'
  },
  {
    image: '/images/products-hero-2.jpg',
    title: 'Titanium Orthopedic Trauma & Bone Fixation Implants',
    label: 'Titanium Locking Plate Technology'
  }
]

export function FeaturedProducts() {
  const [products, setProducts] = useState<FeaturedProductItem[]>(DEFAULT_FEATURED_PRODUCTS)
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null)
  const [bgSlideIndex, setBgSlideIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Fetch dynamic featured products updated by admin
  useEffect(() => {
    async function loadDynamicFeatured() {
      try {
        const res = await fetch('/api/admin/featured-products')
        const data = await res.json()
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          setProducts(data.items)
        }
      } catch (e) {
        // Fallback to defaults
      }
    }
    loadDynamicFeatured()
  }, [])

  // Slideshow timer for background crossfade
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setBgSlideIndex(prev => (prev + 1) % BACKGROUND_SLIDES.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const nextBgSlide = () => {
    setBgSlideIndex(prev => (prev + 1) % BACKGROUND_SLIDES.length)
  }

  const prevBgSlide = () => {
    setBgSlideIndex(prev => (prev - 1 + BACKGROUND_SLIDES.length) % BACKGROUND_SLIDES.length)
  }

  return (
    <section className='relative py-24 border-b border-slate-800/80 overflow-hidden bg-slate-950 text-white'>
      
      {/* ── BACKGROUND SLIDESHOW LAYER ── */}
      <div className='absolute inset-0 z-0 pointer-events-none'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={bgSlideIndex}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className='absolute inset-0 w-full h-full'
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={BACKGROUND_SLIDES[bgSlideIndex].image}
              alt={BACKGROUND_SLIDES[bgSlideIndex].title}
              className='w-full h-full object-cover object-center filter brightness-[0.32] contrast-125 saturate-110'
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic dark gradients for crystal-clear readability */}
        <div className='absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/95' />
        <div className='absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/90' />
        <div className='absolute inset-0 bg-[radial-gradient(#3b82f6_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-25' />
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 relative z-10'>
        
        {/* Section Heading & Slideshow Navigation Bar */}
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6'>
          <div>
            <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-400/30 backdrop-blur-md'>
              <Sparkles size={13} className='text-blue-400' />
              <span>Hot Selling Export Line • Ultra HD Presentation</span>
            </div>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight'>
              Featured Surgical Instruments
            </h2>
            <p className='text-slate-300 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed'>
              Explore our most requested export models with technical engineering specifications and 360° inspection demos.
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-3 self-start md:self-auto'>
            {/* Background Slideshow Controls */}
            <div className='flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 backdrop-blur-md shadow-lg'>
              <span className='text-[11px] font-bold text-slate-300 mr-1.5 hidden sm:inline'>
                Background: {bgSlideIndex + 1}/{BACKGROUND_SLIDES.length}
              </span>

              <button
                onClick={() => setIsAutoPlaying(p => !p)}
                className='p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors'
                title={isAutoPlaying ? 'Pause background slideshow' : 'Resume background slideshow'}
                aria-label={isAutoPlaying ? 'Pause background slideshow' : 'Resume background slideshow'}
              >
                {isAutoPlaying ? <Pause size={13} /> : <Play size={13} />}
              </button>

              <button
                onClick={prevBgSlide}
                className='p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors'
                title='Previous background image'
                aria-label='Previous background image'
              >
                <ChevronLeft size={14} />
              </button>

              <button
                onClick={nextBgSlide}
                className='p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors'
                title='Next background image'
                aria-label='Next background image'
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <Link
              href='/shop'
              className='inline-flex items-center gap-2 text-xs font-bold text-white hover:text-blue-300 bg-blue-600/90 hover:bg-blue-600 border border-blue-500/50 px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-xl transition-all'
            >
              <span>View Full 1,500+ Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 4 to 5 Featured Product / Video Boxes */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {products.map((prod, idx) => (
            <div 
              key={prod.id} 
              className='bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-700/80 shadow-2xl hover:border-blue-500/50 hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group'
            >
              <div>
                
                {/* Video / Showcase Header Container with Real High-Definition Background */}
                <div className='relative h-52 bg-slate-950 p-4 flex flex-col justify-between overflow-hidden'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={prod.image} 
                    alt={prod.title} 
                    className='absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/30 pointer-events-none' />
                  <div className='absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none' />
                  
                  {/* Top Badge */}
                  <div className='flex items-center justify-between relative z-10'>
                    <span className='text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-600 text-white shadow-md'>
                      {prod.tag}
                    </span>
                    <span className='text-[10px] text-slate-200 font-semibold bg-slate-900/85 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-sm'>
                      {prod.category}
                    </span>
                  </div>

                  {/* Center Video Play Demonstration Trigger */}
                  <div className='relative z-10 flex items-center justify-center my-auto'>
                    <button
                      onClick={() => setActiveVideoIndex(idx)}
                      className='w-12 h-12 rounded-full bg-slate-950/70 hover:bg-blue-600 text-white backdrop-blur-md flex items-center justify-center border border-white/30 hover:border-blue-500 transition-all shadow-xl group-hover:scale-110'
                      aria-label={`Play product demonstration for ${prod.title}`}
                    >
                      <Play size={18} className='ml-0.5 fill-white' />
                    </button>
                  </div>

                  {/* Video indicator text */}
                  <div className='relative z-10 flex items-center justify-between text-[11px] text-slate-200 bg-slate-950/85 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-sm'>
                    <span className='flex items-center gap-1'>
                      <Video size={12} className='text-blue-400' />
                      <span>{prod.videoUrl ? 'HD Product Video' : '360° Inspection Video'}</span>
                    </span>
                    <span className='text-[10px] text-slate-400 font-mono'>4K Precision</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className='p-6 space-y-3'>
                  <h3 className='font-bold text-white text-base group-hover:text-blue-400 transition-colors leading-snug'>
                    {prod.title}
                  </h3>
                  <p className='text-xs text-slate-300 leading-relaxed font-normal'>
                    {prod.description}
                  </p>

                  <div className='space-y-1.5 pt-2'>
                    {prod.specs.map((spec, sIdx) => (
                      <div key={sIdx} className='flex items-center gap-2 text-[11px] text-slate-300'>
                        <div className='w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0' />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className='p-6 pt-0'>
                <Link
                  href='/quote'
                  className='flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-600/20'
                >
                  <Send size={13} />
                  <span>Request RFQ for this Model</span>
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Video Demonstration Modal */}
        {activeVideoIndex !== null && products[activeVideoIndex] && (
          <div className='fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4'>
            <div className='bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-800 text-white text-center space-y-4 shadow-2xl overflow-hidden'>
              <div className='w-14 h-14 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400'>
                <Video size={26} />
              </div>
              <div>
                <span className='text-[11px] font-bold text-blue-400 uppercase tracking-wider'>
                  {products[activeVideoIndex].category}
                </span>
                <h3 className='text-xl sm:text-2xl font-black text-white mt-1'>
                  {products[activeVideoIndex].title}
                </h3>
              </div>
              <p className='text-xs text-slate-300 max-w-lg mx-auto leading-relaxed'>
                {products[activeVideoIndex].description}
              </p>

              {/* Actual Video Player or Demo Stream */}
              <div className='aspect-video bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 overflow-hidden relative shadow-inner'>
                {products[activeVideoIndex].videoUrl ? (
                  <video
                    src={products[activeVideoIndex].videoUrl}
                    poster={products[activeVideoIndex].image}
                    controls
                    autoPlay
                    playsInline
                    className='w-full h-full object-contain'
                  />
                ) : (
                  <div className='text-xs text-slate-400 flex flex-col items-center gap-2 p-6'>
                    <Sparkles size={24} className='text-blue-400 animate-pulse' />
                    <span className='font-bold text-white'>Instrument 360° Inspection Video Stream</span>
                    <span className='text-[11px] text-slate-500 max-w-sm'>
                      Direct factory passivated finish inspection. Admin can upload custom MP4/WebM video from Admin Panel.
                    </span>
                  </div>
                )}
              </div>

              <div className='pt-2'>
                <button
                  onClick={() => setActiveVideoIndex(null)}
                  className='bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-7 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20'
                >
                  Close Video Preview
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
