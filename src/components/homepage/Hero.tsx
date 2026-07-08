'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Shield, Truck, RotateCcw, BadgeCheck } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    image: '/uploads/products/1st-slider.png',
    badge: 'Trusted by 200K+ Medical Professionals',
    headline: 'Premium Surgical\nInstruments',
    subtext: 'ISO-certified instruments crafted in Sialkot, Pakistan — manufacturing medical and dental instruments and supplies.',
    cta1: { label: 'Shop Now', href: '/shop' },
    cta2: { label: 'Wholesale Inquiry', href: '/wholesale' },
  },
  {
    id: 2,
    image: '/uploads/products/2-slider.png',
    badge: 'ISO 9001:2015 & CE Certified',
    headline: 'Orthopedic &\nDental Instruments',
    subtext: 'Precision-engineered tools for orthopedic surgery, dental care, and specialized medical procedures.',
    cta1: { label: 'Browse Catalog', href: '/shop?category=Orthopedic' },
    cta2: { label: 'Get a Quote', href: '/contact' },
  },
  {
    id: 3,
    image: '/uploads/products/3-slider.png',
    badge: 'Bulk & Wholesale Available',
    headline: 'Wholesale Pricing\nfor Professionals',
    subtext: 'Volume discounts up to 40% off for hospitals, clinics, and distributors. Apply for a wholesale account today.',
    cta1: { label: 'Apply for Wholesale', href: '/wholesale' },
    cta2: { label: 'Contact Sales', href: '/contact' },
  },
  {
    id: 4,
    image: '/uploads/products/4-slider.png',
    badge: 'Quality You Can Trust',
    headline: 'Medical & Dental\nSupplies',
    subtext: 'Complete range of medical and dental instruments and supplies — manufactured to the highest international standards.',
    cta1: { label: 'View Products', href: '/shop' },
    cta2: { label: 'About Us', href: '/about' },
  },
]

const BADGES = [
  { icon: BadgeCheck, label: 'ISO 9001 Certified' },
  { icon: Truck,      label: 'Free Shipping $150+' },
  { icon: RotateCcw,  label: '30-Day Returns' },
  { icon: Shield,     label: '24/7 Support' },
]

export function Hero() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const next = useCallback(() => {
    setDirection(1)
    setCurrent(c => (c + 1) % SLIDES.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const slide = SLIDES[current]

  return (
    <section data-testid='hero-section' className='relative w-full h-[85vh] min-h-[560px] overflow-hidden'>

      {/* ── Background image layer ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className='absolute inset-0'
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.headline}
            className='w-full h-full object-cover object-center'
          />
          {/* Dark overlay so text is readable */}
          <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20' />
        </motion.div>
      </AnimatePresence>

      {/* ── Text content ── */}
      <div className='relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={slide.id + '-text'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className='max-w-2xl space-y-5'
          >
            <span className='inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30'>
              {slide.badge}
            </span>

            <h1 className='font-lora text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg'>
              {slide.headline.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h1>

            <p className='text-lg text-white/85 max-w-lg leading-relaxed'>
              {slide.subtext}
            </p>

            <div className='flex flex-wrap gap-3 pt-2'>
              <Link href={slide.cta1.href}
                className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg'>
                {slide.cta1.label}
              </Link>
              <Link href={slide.cta2.href}
                className='bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/40 text-white font-bold px-8 py-3 rounded-xl transition'>
                {slide.cta2.label}
              </Link>
            </div>

            {/* Trust badges — only on first slide */}
            {slide.id === 1 && (
              <div className='flex flex-wrap gap-4 pt-4'>
                {BADGES.map(b => (
                  <div key={b.label} className='flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20'>
                    <b.icon size={16} className='text-blue-300' />
                    <span className='text-white text-xs font-semibold'>{b.label}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Arrows ── */}
      <button onClick={prev} aria-label='Previous slide'
        className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-3 rounded-full border border-white/20 transition'>
        <ChevronLeft size={22} />
      </button>
      <button onClick={next} aria-label='Next slide'
        className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-3 rounded-full border border-white/20 transition'>
        <ChevronRight size={22} />
      </button>

      {/* ── Dot indicators ── */}
      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2'>
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-8' : 'bg-white/40 w-2'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
