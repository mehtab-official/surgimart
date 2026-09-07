'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  ArrowRight, 
  Download, 
  Sparkles, 
  Send, 
  Award, 
  Globe2, 
  CheckCircle2, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Pause,
  Layers,
  Info,
  Video,
  Film
} from 'lucide-react'
import { DEFAULT_SHOWCASE_SLIDES, type ShowcaseItem } from '@/types'

export function Hero() {
  const [slides, setSlides] = useState<ShowcaseItem[]>(DEFAULT_SHOWCASE_SLIDES)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedSlide, setSelectedSlide] = useState<ShowcaseItem | null>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Fetch updated showcase and video items from API if uploaded by admin
  useEffect(() => {
    async function loadDynamicShowcase() {
      try {
        const res = await fetch('/api/admin/showcase')
        const data = await res.json()
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          setSlides(data.items)
        }
      } catch (e) {
        // Fallback to default slides
      }
    }
    loadDynamicShowcase()
  }, [])

  // Slideshow Autoplay timer (pauses if active slide is a playing video or if modal is open)
  useEffect(() => {
    const isVideoSlide = slides[currentSlide]?.mediaType === 'video' && Boolean(slides[currentSlide]?.videoUrl)
    
    if (!isPlaying || selectedSlide !== null || isVideoSlide) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      return
    }

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 4500)

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isPlaying, selectedSlide, currentSlide, slides])

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  }

  const active = slides[currentSlide] || DEFAULT_SHOWCASE_SLIDES[0]

  return (
    <section className='relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden py-16 sm:py-24 lg:py-28'>
      
      {/* Background medical grid decorative pattern */}
      <div className='absolute inset-0 bg-[radial-gradient(#3b82f6_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-20 pointer-events-none' />
      <div className='absolute -right-40 -top-40 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute left-1/3 -bottom-40 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
          
          {/* Left Column: Heading & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='lg:col-span-7 space-y-6 text-center lg:text-left'
          >
            
            {/* Top Badge */}
            <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30'>
              <Award size={13} className='text-blue-400' />
              <span>15+ Years of Precision Manufacturing • Sialkot Export Hub</span>
            </div>

            {/* Main Headline */}
            <h1 className='text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.1]'>
              Precision Engineered <br />
              <span className='bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent'>
                Surgical & Orthopedic
              </span> <br />
              Instruments
            </h1>

            {/* Description */}
            <p className='text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal'>
              Manufacturing international-grade surgical instruments, orthopedic bone fixation systems, and custom OEM medical tools for hospitals, clinics, and global distributors.
            </p>

            {/* Key Quality Pillars */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-200'>
              <div className='flex items-center justify-center lg:justify-start gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl'>
                <CheckCircle2 size={14} className='text-blue-400 shrink-0' />
                <span>ISO 9001:2015 & 13485:2016</span>
              </div>
              <div className='flex items-center justify-center lg:justify-start gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl'>
                <CheckCircle2 size={14} className='text-blue-400 shrink-0' />
                <span>AISI 410/420 German Grade</span>
              </div>
              <div className='flex items-center justify-center lg:justify-start gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl'>
                <CheckCircle2 size={14} className='text-blue-400 shrink-0' />
                <span>Worldwide Export Logistics</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-4'>
              
              {/* Request a Quote Button */}
              <Link 
                href='/quote'
                className='inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all'
              >
                <Send size={15} />
                <span>Request a Quote (RFQ)</span>
              </Link>

              {/* Download PDF Catalogue Button */}
              <Link 
                href='/catalogue'
                className='inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-6 py-3.5 rounded-xl border border-white/20 transition-all backdrop-blur-sm'
              >
                <Download size={15} className='text-blue-400' />
                <span>Download PDF Catalogue</span>
              </Link>

              {/* Explore Catalog */}
              <Link 
                href='/shop'
                className='inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white px-3 py-2 transition-colors'
              >
                <span>Browse Products</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Slideshow Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='lg:col-span-5'
          >
            <div className='relative rounded-3xl bg-slate-900/90 border border-slate-700/80 p-3.5 sm:p-4 shadow-2xl backdrop-blur-md overflow-hidden group'>
              
              {/* Top Navigation & Status Bar inside Container */}
              <div className='flex items-center justify-between pb-3 px-1 border-b border-slate-800/80'>
                <div className='flex items-center gap-2'>
                  <span className='flex h-2 w-2 relative'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-blue-500'></span>
                  </span>
                  <span className='text-xs font-bold text-slate-200 tracking-wide'>
                    Instrument Showcase ({currentSlide + 1}/{slides.length})
                  </span>
                </div>

                <div className='flex items-center gap-1.5'>
                  {/* Play / Pause Toggle */}
                  <button 
                    onClick={() => setIsPlaying(p => !p)}
                    className='p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors'
                    title={isPlaying ? 'Pause Slideshow' : 'Resume Slideshow'}
                    aria-label={isPlaying ? 'Pause Slideshow' : 'Resume Slideshow'}
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                  </button>

                  {/* Previous Slide */}
                  <button 
                    onClick={prevSlide}
                    className='p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors'
                    title='Previous Slide'
                    aria-label='Previous Slide'
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {/* Next Slide */}
                  <button 
                    onClick={nextSlide}
                    className='p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors'
                    title='Next Slide'
                    aria-label='Next Slide'
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Main Feature Slideshow Container with Smooth Aspect Ratio & Dynamic Content Presentation */}
              <div 
                onClick={() => setSelectedSlide(active)}
                className='relative mt-3 h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-700/60 cursor-pointer group/main transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10'
                title='Click to view full image and specifications'
              >
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className='w-full h-full relative'
                  >
                    {/* Main Visual: Video or Image */}
                    {active.mediaType === 'video' && active.videoUrl ? (
                      <video 
                        ref={videoRef}
                        src={active.videoUrl} 
                        poster={active.image}
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        className='w-full h-full object-cover object-center'
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={active.image} 
                        alt={active.title} 
                        className='w-full h-full object-cover object-center transition-transform duration-700 group-hover/main:scale-105'
                      />
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent pointer-events-none' />
                    <div className='absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent pointer-events-none' />
                    
                    {/* Top Badges */}
                    <div className='absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur text-amber-400 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30 shadow-md'>
                      <ShieldCheck size={13} className='text-amber-400' />
                      <span>{active.badge}</span>
                    </div>

                    {/* Media Type / Expand Fullscreen Cue */}
                    <div className='absolute top-3 right-3 flex items-center gap-2'>
                      {active.mediaType === 'video' && (
                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-[10px] font-bold border border-red-500 shadow-md'>
                          <Video size={11} />
                          <span>Video</span>
                        </span>
                      )}
                      <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur text-slate-200 text-[11px] font-bold border border-slate-700 opacity-90 group-hover/main:opacity-100 group-hover/main:bg-blue-600 group-hover/main:border-blue-500 transition-all shadow-md'>
                        <Maximize2 size={12} />
                        <span className='hidden sm:inline'>Inspect Info</span>
                      </div>
                    </div>

                    {/* Bottom Dynamic Overlay Info */}
                    <div className='absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-slate-950/90 backdrop-blur border border-slate-800/90 shadow-xl flex items-center justify-between gap-3 pointer-events-none'>
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-2'>
                          <span className='text-[10px] font-bold uppercase tracking-wider text-blue-400'>{active.category}</span>
                          <span className='text-slate-600 text-[10px]'>•</span>
                          <span className='text-[10px] text-slate-300 font-medium truncate'>{active.subtitle}</span>
                        </div>
                        <p className='text-xs sm:text-sm font-bold text-white truncate mt-0.5'>{active.title}</p>
                      </div>
                      <span className='shrink-0 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg'>
                        {active.compliance}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Slideshow Progress Bar */}
                <div className='absolute bottom-0 left-0 right-0 h-1 bg-slate-800/60 z-20'>
                  <motion.div 
                    key={currentSlide}
                    initial={{ width: '0%' }}
                    animate={{ width: isPlaying ? '100%' : '0%' }}
                    transition={{ duration: 4.5, ease: 'linear' }}
                    className='h-full bg-blue-500'
                  />
                </div>
              </div>

              {/* Interactive Thumbnail Carousel Buttons */}
              <div className='flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700'>
                {slides.map((slide, index) => {
                  const isCurrent = currentSlide === index
                  const isVideoThumb = slide.mediaType === 'video' && Boolean(slide.videoUrl)
                  return (
                    <button
                      key={slide.id}
                      onClick={() => {
                        setCurrentSlide(index)
                        setIsPlaying(false)
                      }}
                      className={`relative flex-1 min-w-[72px] sm:min-w-[85px] h-16 sm:h-20 rounded-xl overflow-hidden border transition-all text-left shrink-0 group/thumb ${
                        isCurrent 
                          ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-md scale-[1.02]' 
                          : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className='w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300' 
                      />
                      <div className={`absolute inset-0 transition-colors ${
                        isCurrent ? 'bg-blue-950/20' : 'bg-slate-950/50 group-hover/thumb:bg-transparent'
                      }`} />
                      
                      {/* Video indicator badge on thumbnail */}
                      {isVideoThumb && (
                        <div className='absolute top-1 left-1 bg-red-600/90 text-white rounded p-0.5 shadow'>
                          <Video size={10} />
                        </div>
                      )}

                      {/* Thumbnail Title Overlay */}
                      <div className='absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white truncate bg-slate-950/85 px-1.5 py-0.5 rounded border border-white/5'>
                        {slide.category.split(' ')[0]}
                      </div>

                      {/* Active Indicator dot */}
                      {isCurrent && (
                        <div className='absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-400 ring-2 ring-slate-950' />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Bottom Quick Contact & Partner Bar */}
              <div className='pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 px-1'>
                <div className='flex items-center gap-2'>
                  <span className='text-[11px] text-slate-400'>Verified Manufacturing Partner</span>
                  <span className='hidden sm:inline text-slate-600'>|</span>
                  <span className='hidden sm:inline text-[11px] text-blue-400 font-semibold'>Tap any image for specs</span>
                </div>
                <a 
                  href='tel:+923273961505'
                  className='text-amber-400 font-bold text-xs hover:underline'
                >
                  +92 327 3961505
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── DYNAMIC MODAL: PRESENT IMAGE IN PROPER ASPECT RATIO WITH FULL INFO & SPECS ── */}
      <AnimatePresence>
        {selectedSlide && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto'>
            {/* Click backdrop to close */}
            <div 
              className='fixed inset-0' 
              onClick={() => setSelectedSlide(null)} 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              className='relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto'
            >
              {/* Modal Header */}
              <div className='flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400'>
                    <Layers size={18} />
                  </div>
                  <div>
                    <span className='text-xs font-bold uppercase tracking-wider text-blue-400'>
                      {selectedSlide.category}
                    </span>
                    <h3 className='text-lg sm:text-xl font-black text-white'>
                      {selectedSlide.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSlide(null)}
                  className='p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700'
                  aria-label='Close details'
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body: Dynamic 2-column layout (Image with proper aspect ratio + comprehensive presentation) */}
              <div className='grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6 items-center'>
                
                {/* Left Column: Video or Image in Natural Proportions */}
                <div className='md:col-span-7'>
                  <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner flex items-center justify-center ${selectedSlide.aspectRatio}`}>
                    {selectedSlide.mediaType === 'video' && selectedSlide.videoUrl ? (
                      <video 
                        src={selectedSlide.videoUrl} 
                        poster={selectedSlide.image}
                        controls 
                        autoPlay 
                        playsInline
                        className='w-full h-full object-contain p-1'
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={selectedSlide.image} 
                        alt={selectedSlide.title} 
                        className='w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-500'
                      />
                    )}
                    
                    <div className='absolute bottom-3 left-3 pointer-events-none'>
                      <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 text-amber-400 text-xs font-extrabold border border-amber-500/30 backdrop-blur-md shadow-lg'>
                        <ShieldCheck size={14} />
                        {selectedSlide.compliance}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Content Presentation & Specs */}
                <div className='md:col-span-5 space-y-4'>
                  <div>
                    <span className='inline-block px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 text-xs font-bold border border-blue-400/20 mb-2'>
                      {selectedSlide.badge}
                    </span>
                    <h4 className='text-base font-bold text-white'>{selectedSlide.subtitle}</h4>
                    <p className='text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-normal'>
                      {selectedSlide.description}
                    </p>
                  </div>

                  {/* Specification Badges */}
                  <div className='space-y-2 pt-2 border-t border-slate-800'>
                    <span className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                      Technical Specifications
                    </span>
                    <ul className='grid grid-cols-1 gap-2'>
                      {selectedSlide.specs.map(spec => (
                        <li key={spec} className='flex items-center gap-2 text-xs text-slate-200 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/60'>
                          <CheckCircle2 size={13} className='text-blue-400 shrink-0' />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions in Modal */}
                  <div className='flex flex-wrap gap-2.5 pt-4'>
                    <Link
                      href='/quote'
                      onClick={() => setSelectedSlide(null)}
                      className='flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all'
                    >
                      <Send size={14} />
                      <span>Inquire This System</span>
                    </Link>
                    <Link
                      href='/catalogue'
                      onClick={() => setSelectedSlide(null)}
                      className='inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 px-4 rounded-xl border border-slate-700 transition-colors'
                    >
                      <Download size={14} className='text-blue-400' />
                      <span>Catalogue PDF</span>
                    </Link>
                  </div>
                </div>

              </div>

              {/* Modal Footer Controls (Switch slides inside modal) */}
              <div className='flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400'>
                <span>Viewing slide {slides.findIndex(s => s.id === selectedSlide.id) + 1} of {slides.length}</span>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => {
                      const idx = slides.findIndex(s => s.id === selectedSlide.id)
                      const prevIdx = (idx - 1 + slides.length) % slides.length
                      setSelectedSlide(slides[prevIdx])
                      setCurrentSlide(prevIdx)
                    }}
                    className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors'
                  >
                    <ChevronLeft size={13} /> Previous
                  </button>
                  <button
                    onClick={() => {
                      const idx = slides.findIndex(s => s.id === selectedSlide.id)
                      const nextIdx = (idx + 1) % slides.length
                      setSelectedSlide(slides[nextIdx])
                      setCurrentSlide(nextIdx)
                    }}
                    className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors'
                  >
                    Next <ChevronRight size={13} />
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}

