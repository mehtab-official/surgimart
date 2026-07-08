'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function PromoBanners() {
  return (
    <section className='max-w-7xl mx-auto px-4 py-8'>
      <div className='grid md:grid-cols-2 gap-6'>
        <motion.div initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
          className='bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-2xl'>
          <p className='text-xs font-bold uppercase tracking-wider text-blue-200'>Wholesale Program</p>
          <h3 className='font-lora text-2xl font-bold mt-2 mb-3'>Save Up to 40% on Bulk Orders</h3>
          <p className='text-blue-100 text-sm mb-4'>Join 500+ healthcare distributors worldwide.</p>
          <Link href='/wholesale' className='bg-white text-blue-600 font-bold px-6 py-2 rounded-lg text-sm hover:bg-blue-50'>Apply Now</Link>
        </motion.div>
        <motion.div initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
          className='bg-gradient-to-r from-teal-600 to-teal-800 text-white p-8 rounded-2xl'>
          <p className='text-xs font-bold uppercase tracking-wider text-teal-200'>Free Shipping</p>
          <h3 className='font-lora text-2xl font-bold mt-2 mb-3'>On Orders Over $150</h3>
          <p className='text-teal-100 text-sm mb-4'>Fast worldwide delivery with tracking.</p>
          <Link href='/shop' className='bg-white text-teal-600 font-bold px-6 py-2 rounded-lg text-sm hover:bg-teal-50'>Shop Now</Link>
        </motion.div>
      </div>
    </section>
  )
}
