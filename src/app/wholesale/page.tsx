'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { CheckCircle2 } from 'lucide-react'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  organization: z.string().min(1, 'Required'),
  country: z.string().min(2, 'Required'),
  monthlyVolume: z.string().min(1, 'Required'),
  categories: z.array(z.string()).min(1, 'Select at least 1'),
  message: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const CATEGORIES = ['Surgical', 'Dental', 'Orthopedic', 'Veterinary', 'ENT', 'Ophthalmology', 'Hospital Furniture']

export default function WholesalePage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { categories: [] } })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const res = await fetch('/api/wholesale', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.status === 409) { toast.error('Email already submitted'); return }
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch { toast.error('Something went wrong') }
    finally { setLoading(false) }
  }

  if (submitted) {
    return (
      <section className='max-w-lg mx-auto px-4 py-20 text-center'>
        <CheckCircle2 size={64} className='mx-auto text-green-500 mb-4' />
        <h2 className='font-lora text-2xl font-bold'>Application Received!</h2>
        <p className='text-slate-600 mt-2'>Our team will review your application and respond within 24 hours.</p>
      </section>
    )
  }

  return (
    <section className='max-w-7xl mx-auto px-4 py-16'>
      <div className='text-center mb-12'>
        <h1 className='font-lora text-4xl font-bold mb-3'>Wholesale Portal</h1>
        <p className='text-lg text-slate-600'>Join 500+ Healthcare Distributors Worldwide</p>
      </div>
      <div className='grid md:grid-cols-4 gap-4 mb-12'>
        {[
          { tier: 'Retail', range: '1-9 units', discount: 'Full Price' },
          { tier: 'Standard', range: '10-49 units', discount: '15% Off' },
          { tier: 'Professional', range: '50-199 units', discount: '25% Off' },
          { tier: 'Enterprise', range: '200+ units', discount: '40% Off' },
        ].map(t => (
          <div key={t.tier} className='bg-white border border-slate-200 rounded-2xl p-6 text-center'>
            <h3 className='font-bold mb-1'>{t.tier}</h3>
            <p className='text-xs text-slate-500 mb-3'>{t.range}</p>
            <p className='text-lg font-bold text-blue-600'>{t.discount}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='max-w-xl mx-auto space-y-4 bg-slate-50 p-8 rounded-2xl'>
          <div><label htmlFor='firstName' className='text-sm font-medium block mb-1'>First Name</label>
            <input id='firstName' {...register('firstName')} data-testid='wholesale-firstname' className='w-full border rounded-lg px-3 py-2.5 text-sm' />
            {errors.firstName && <p data-testid='wholesale-firstname-error' className='text-xs text-red-500'>{errors.firstName.message}</p>}</div>
          <div><label htmlFor='lastName' className='text-sm font-medium block mb-1'>Last Name</label>
            <input id='lastName' {...register('lastName')} data-testid='wholesale-lastname' className='w-full border rounded-lg px-3 py-2.5 text-sm' />
            {errors.lastName && <p data-testid='wholesale-lastname-error' className='text-xs text-red-500'>{errors.lastName.message}</p>}</div>
        <div><label htmlFor='email' className='text-sm font-medium block mb-1'>Email</label>
          <input id='email' {...register('email')} type='email' data-testid='wholesale-email' className='w-full border rounded-lg px-3 py-2.5 text-sm' />
          {errors.email && <p data-testid='wholesale-email-error' className='text-xs text-red-500'>{errors.email.message}</p>}</div>
        <div><label htmlFor='organization' className='text-sm font-medium block mb-1'>Organization</label>
          <input id='organization' {...register('organization')} className='w-full border rounded-lg px-3 py-2.5 text-sm' />
          {errors.organization && <p className='text-xs text-red-500'>{errors.organization.message}</p>}</div>
        <div className='grid grid-cols-2 gap-4'>
          <div><label htmlFor='country' className='text-sm font-medium block mb-1'>Country</label>
            <input id='country' {...register('country')} className='w-full border rounded-lg px-3 py-2.5 text-sm' /></div>
          <div><label htmlFor='monthlyVolume' className='text-sm font-medium block mb-1'>Monthly Volume</label>
            <select id='monthlyVolume' {...register('monthlyVolume')} className='w-full border rounded-lg px-3 py-2.5 text-sm'>
              <option value=''>Select</option><option>&lt;$1K</option><option>$1K-$5K</option><option>$5K-$20K</option><option>$20K+</option>
            </select></div>
        </div>
        <div><label className='text-sm font-medium block mb-2'>Categories of Interest</label>
          <div className='grid grid-cols-2 gap-2'>
            {CATEGORIES.map(cat => (
              <label key={cat} className='flex items-center gap-2 text-sm'>
                <input {...register('categories')} type='checkbox' value={cat} /> {cat}
              </label>
            ))}
          </div>
          {errors.categories && <p className='text-xs text-red-500'>{errors.categories.message}</p>}
        </div>
        <div><label className='text-sm font-medium block mb-1'>Message (optional)</label>
          <textarea {...register('message')} rows={3} className='w-full border rounded-lg px-3 py-2.5 text-sm' /></div>
        <button type='submit' disabled={loading} className='w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50'>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </section>
  )
}
