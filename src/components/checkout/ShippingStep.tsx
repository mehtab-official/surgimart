'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useCallback, useRef } from 'react'
import type { ShippingData } from '@/types'

const COUNTRIES = [
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'QA', name: 'Qatar' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
]

const shippingSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Too short'),
  address1: z.string().min(5, 'Too short'),
  city: z.string().min(1, 'Required'),
  country: z.string().length(2, 'Select a country'),
  postalCode: z.string().optional(),
})

interface Props { onComplete: (data: ShippingData) => void }

const STORAGE_KEY = 'surgimart-checkout-shipping'

export function ShippingStep({ onComplete }: Props) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ShippingData>({
    resolver: zodResolver(shippingSchema),
  })

  // M-12: Debounced timer ref to avoid writing to sessionStorage on every keystroke
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { reset(JSON.parse(saved)) } catch { /* ignore corrupted data */ }
    }
  }, [reset])

  // M-12: Debounce sessionStorage writes to once every 500ms
  const watchAll = watch()
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(watchAll))
    }, 500)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [watchAll])

  // M-3: Clear PII from sessionStorage on form submission
  const handleFormSubmit = useCallback((data: ShippingData) => {
    sessionStorage.removeItem(STORAGE_KEY)
    onComplete(data)
  }, [onComplete])

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='text-sm font-medium block mb-1'>First Name</label>
          <input {...register('firstName')} name='firstName' data-testid='shipping-firstname' className='w-full border rounded-lg px-3 py-2.5 text-sm' />
          {errors.firstName && <p data-testid='shipping-firstname-error' className='text-xs text-red-500 mt-1'>{errors.firstName.message}</p>}
        </div>
        <div>
          <label className='text-sm font-medium block mb-1'>Last Name</label>
          <input {...register('lastName')} name='lastName' data-testid='shipping-lastname' className='w-full border rounded-lg px-3 py-2.5 text-sm' />
          {errors.lastName && <p data-testid='shipping-lastname-error' className='text-xs text-red-500 mt-1'>{errors.lastName.message}</p>}
        </div>
      </div>
      <div>
        <label className='text-sm font-medium block mb-1'>Email</label>
        <input {...register('email')} name='email' type='email' data-testid='shipping-email' className='w-full border rounded-lg px-3 py-2.5 text-sm' />
        {errors.email && <p data-testid='shipping-email-error' className='text-xs text-red-500 mt-1'>{errors.email.message}</p>}
      </div>
      <div>
        <label className='text-sm font-medium block mb-1'>Phone</label>
        <input {...register('phone')} name='phone' data-testid='shipping-phone' className='w-full border rounded-lg px-3 py-2.5 text-sm' />
        {errors.phone && <p data-testid='shipping-phone-error' className='text-xs text-red-500 mt-1'>{errors.phone.message}</p>}
      </div>
      <div>
        <label className='text-sm font-medium block mb-1'>Address</label>
        <input {...register('address1')} name='address1' data-testid='shipping-address1' className='w-full border rounded-lg px-3 py-2.5 text-sm' />
        {errors.address1 && <p data-testid='shipping-address-error' className='text-xs text-red-500 mt-1'>{errors.address1.message}</p>}
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='text-sm font-medium block mb-1'>City</label>
          <input {...register('city')} name='city' data-testid='shipping-city' className='w-full border rounded-lg px-3 py-2.5 text-sm' />
          {errors.city && <p data-testid='shipping-city-error' className='text-xs text-red-500 mt-1'>{errors.city.message}</p>}
        </div>
        <div>
          <label className='text-sm font-medium block mb-1'>Country</label>
          <select {...register('country')} name='country' data-testid='shipping-country' className='w-full border rounded-lg px-3 py-2.5 text-sm'>
            <option value="">Select Country</option>
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
          {errors.country && <p data-testid='shipping-country-error' className='text-xs text-red-500 mt-1'>{errors.country.message}</p>}
        </div>
      </div>
      <div>
        <label className='text-sm font-medium block mb-1'>Postal Code (optional)</label>
        <input {...register('postalCode')} name='postalCode' className='w-full border rounded-lg px-3 py-2.5 text-sm' />
      </div>
      <button type='submit' data-testid='continue-to-payment' className='w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700'>
        Continue to Payment
      </button>
    </form>
  )
}
