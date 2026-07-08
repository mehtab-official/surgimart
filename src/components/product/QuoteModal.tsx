'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

const schema = z.object({
  qty: z.number().int().min(1),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  organization: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function QuoteModal({ product, open, onClose }: { product: Product; open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { qty: product.moq || 10 }
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, productId: product.id, productName: product.name })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to send')
      }
      toast.success('Quote request sent!')
      reset()
      onClose()
    } catch (e: unknown) {
      if (e instanceof Error) toast.error(e.message)
      else toast.error(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className='fixed inset-0 bg-black/50 z-50' onClick={onClose} />
          <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.95, opacity:0 }}
            data-testid='quote-modal'
            className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-md z-50 shadow-2xl'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='font-bold text-lg'>Request Bulk Quote</h3>
              <button onClick={onClose}><X size={20} /></button>
            </div>
            <p className='text-sm text-slate-600 mb-4'>Get pricing for <strong>{product.name}</strong></p>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
              <div>
                <label className='text-sm font-medium'>Quantity</label>
                <input {...register('qty', { valueAsNumber: true })} type='number' data-testid='quote-qty' className='w-full border rounded-lg px-3 py-2 text-sm' />
                {errors.qty && <p data-testid='quote-qty-error' className='text-xs text-red-500 mt-1'>{errors.qty.message}</p>}
              </div>
              <div>
                <label className='text-sm font-medium'>Name</label>
                <input {...register('name')} data-testid='quote-name' className='w-full border rounded-lg px-3 py-2 text-sm' />
                {errors.name && <p data-testid='quote-name-error' className='text-xs text-red-500 mt-1'>{errors.name.message}</p>}
              </div>
              <div>
                <label className='text-sm font-medium'>Email</label>
                <input {...register('email')} type='email' data-testid='quote-email' className='w-full border rounded-lg px-3 py-2 text-sm' />
                {errors.email && <p data-testid='quote-email-error' className='text-xs text-red-500 mt-1'>{errors.email.message}</p>}
              </div>
              <div>
                <label className='text-sm font-medium'>Organization</label>
                <input {...register('organization')} className='w-full border rounded-lg px-3 py-2 text-sm' />
              </div>
              <div>
                <label htmlFor='quote-country' className='text-sm font-medium'>Country</label>
                <input id='quote-country' {...register('country')} className='w-full border rounded-lg px-3 py-2 text-sm' />
                {errors.country && <p className='text-xs text-red-500 mt-1'>{errors.country.message}</p>}
              </div>
              <div>
                <label className='text-sm font-medium'>Message</label>
                <textarea {...register('message')} rows={3} className='w-full border rounded-lg px-3 py-2 text-sm' />
              </div>
              <button data-testid='quote-submit' type='submit' disabled={loading}
                className='w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2'>
                <Send size={16} /> {loading ? 'Sending...' : 'Submit Quote Request'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
