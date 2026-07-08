'use client'
import { StarRating } from '@/components/ui/StarRating'

const REVIEWS = [
  { name: 'Dr. Ahmed Khan', country: 'UAE', rating: 5, text: 'Exceptional quality instruments. Have been ordering for my clinic for 3 years.' },
  { name: 'Dr. Sarah Mitchell', country: 'UK', rating: 5, text: 'Fast shipping and excellent packaging. Every instrument arrives in perfect condition.' },
  { name: 'Dr. Raj Patel', country: 'India', rating: 5, text: 'Best value surgical instruments I have found. The wholesale program saved us thousands.' },
]

export function Testimonials() {
  return (
    <section className='max-w-7xl mx-auto px-4 py-16'>
      <h2 className='font-lora text-3xl font-bold text-center mb-3'>Trusted Worldwide</h2>
      <p className='text-center text-slate-500 mb-10'>Hear from our customers</p>
      <div className='grid md:grid-cols-3 gap-6'>
        {REVIEWS.map(r => (
          <div key={r.name} className='bg-white border border-slate-100 rounded-2xl p-6 shadow-sm'>
            <StarRating rating={r.rating} size='sm' />
            <p className='text-sm text-slate-700 mt-3 mb-4'>&quot;{r.text}&quot;</p>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-bold text-slate-900'>{r.name}</p>
              <span className='text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full'>{r.country}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
