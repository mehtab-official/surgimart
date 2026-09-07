'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

const PRECISION_CATEGORIES = [
  {
    name: 'Micro / General Surgery',
    discipline: 'General Surgery & Forceps',
    slug: 'surgical',
    image: '/images/categories/general-surgery.png',
    itemsCount: '450+ Instruments',
    description: 'Hemostatic forceps, Mayo dissecting scissors, needle holders, and retractor sets.',
  },
  {
    name: 'Orthopedic Instruments & Implants',
    discipline: 'Trauma & Bone Fixation',
    slug: 'orthopedic',
    image: '/images/categories/orthopedic.png',
    itemsCount: '600+ Instruments',
    description: 'Stille-Luer bone rongeurs, titanium locking plates, cortical screws & cutters.',
  },
  {
    name: 'ENT Specialty Instruments',
    discipline: 'Ear, Nose & Throat Diagnostics',
    slug: 'ent',
    image: '/images/categories/ent.png',
    itemsCount: '280+ Instruments',
    description: 'Micro laryngeal suction tubes, Hartmann forceps, speculums, and mouth gags.',
  },
  {
    name: 'Dental Surgery Instruments',
    discipline: 'Extraction & Probes',
    slug: 'dental',
    image: '/images/categories/dental.png',
    itemsCount: '320+ Instruments',
    description: 'Extraction forceps, root elevators, periodontal scalers, and probe sets.',
  },
  {
    name: 'Surgical Implants & Prosthetics',
    discipline: 'Trauma & Joint Replacement',
    slug: 'implants',
    image: '/images/implants-joint-replacement.jpg',
    secondaryImage: '/images/implants-trauma-plates.jpg',
    itemsCount: '480+ Implants & Sets',
    description: 'Titanium locking compression plates, cortical trauma screws, femoral & tibial knee joint components.',
  },
  {
    name: 'Veterinary Instruments & Implants',
    discipline: 'Animal Surgery & Fixation',
    slug: 'veterinary',
    image: '/images/categories/veterinary.png',
    itemsCount: '190+ Instruments',
    description: 'Veterinary orthopedic bone plates, castrators, and trauma surgery kits.',
  },
]

export function CategoriesGrid() {
  return (
    <section data-testid='categories-grid' className='max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4'>
        <div>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100'>
            <Sparkles size={13} className='text-blue-600' />
            <span>Precision Surgical Instrument Categories</span>
          </div>
          <h2 className='text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight'>
            Explore by Surgical Discipline
          </h2>
          <p className='text-slate-600 text-sm sm:text-base mt-1.5 max-w-2xl'>
            Manufactured from high-grade German stainless steel (AISI 410/420) and pure titanium in Sialkot, Pakistan.
          </p>
        </div>
        <Link 
          href='/catalogue'
          className='inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors shrink-0'
        >
          <span>Download All Discipline Catalogues</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* 6 High-Impact Precision Category Cards from document image6 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {PRECISION_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              href={`/shop?cat=${cat.slug}`}
              data-testid='category-card'
              className='group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full'
            >
              {/* Authentic Precision Header Banner from image6.png */}
              <div className='relative w-full h-56 bg-slate-950 overflow-hidden'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className={`w-full h-full object-cover transition-all duration-700 filter brightness-105 contrast-105 ${
                    cat.secondaryImage ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
                  }`}
                />
                {cat.secondaryImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cat.secondaryImage}
                    alt={`${cat.name} trauma plates & fixation`}
                    className='absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 filter brightness-105 contrast-105'
                  />
                )}
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity pointer-events-none' />
                <div className='absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur text-white text-[10px] font-mono font-bold border border-white/20 z-10'>
                  {cat.itemsCount}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className='p-6 flex-1 flex flex-col justify-between space-y-4'>
                <div>
                  <span className='text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full'>
                    {cat.discipline}
                  </span>
                  <h3 className='text-lg font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors'>
                    {cat.name}
                  </h3>
                  <p className='text-xs text-slate-500 mt-1.5 leading-relaxed'>
                    {cat.description}
                  </p>
                </div>

                <div className='pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700'>
                  <span>Explore Showcase & Specs</span>
                  <ArrowRight size={14} className='group-hover:translate-x-1 transition-transform' />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
