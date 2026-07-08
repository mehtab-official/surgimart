'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const CATEGORIES = [
  {
    name: 'Forceps',
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    image: '/uploads/products/forceps.png',
  },
  {
    name: 'Dental',
    color: 'bg-teal-50',
    textColor: 'text-teal-700',
    image: '/uploads/products/Dental.png',
  },
  {
    name: 'Orthopedic',
    color: 'bg-purple-50',
    textColor: 'text-purple-700',
    image: '/uploads/products/orthopedic.png',
  },
  {
    name: 'Ophthalmology',
    color: 'bg-amber-50',
    textColor: 'text-amber-700',
    image: '/uploads/products/opthalmoogy.png',
  },
  {
    name: 'ENT',
    color: 'bg-rose-50',
    textColor: 'text-rose-700',
    image: '/uploads/products/ENT.png',
  },
  {
    name: 'Cardiovascular',
    color: 'bg-red-50',
    textColor: 'text-red-700',
    image: '/uploads/products/cardiovascular.png',
  },
  {
    name: 'Veterinary',
    color: 'bg-green-50',
    textColor: 'text-green-700',
    image:'/uploads/products/Veterinary.png',
  },
  {
    name: 'Gynecology',
    color: 'bg-pink-50',
    textColor: 'text-pink-700',
    image: '/uploads/products/gynocology.png',
  },
]

export function CategoriesGrid() {
  return (
    <section data-testid='categories-grid' className='max-w-7xl mx-auto px-4 py-16'>
      <h2 className='font-lora text-3xl font-bold text-center mb-3'>Shop by Category</h2>
      <p className='text-center text-slate-500 mb-10'>Explore our complete range of medical instruments</p>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={`/shop?cat=${cat.name.toLowerCase()}`}
              data-testid='category-card'
              className={`${cat.color} rounded-2xl overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all group`}
            >
              {/* Image */}
              <div className='relative w-full h-52 overflow-hidden'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                />
                <div className='absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors' />
              </div>
              {/* Label */}
              <div className='px-4 py-4 text-center'>
                <span className='font-bold text-base text-slate-800'>{cat.name}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
