'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const contactSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(1, 'Required'),
  message: z.string().min(10, 'At least 10 characters'),
})
type ContactData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactData>({ resolver: zodResolver(contactSchema) })

  async function onSubmit() {
    setLoading(true)
    try {
      toast.success('Message sent!')
      reset()
    } catch { toast.error('Failed to send') }
    finally { setLoading(false) }
  }

  return (
    <section className='max-w-7xl mx-auto px-4 py-16'>
      <h1 className='font-lora text-3xl font-bold text-center mb-3'>Contact Us</h1>
      <p className='text-center text-slate-500 mb-12'>We&apos;re here to help. Get in touch with our team.</p>
      <div className='grid md:grid-cols-2 gap-12'>
        <div className='space-y-8'>
          <div className='flex gap-4'>
            <MapPin className='text-blue-600 shrink-0' />
            <div>
              <h3 className='font-bold'>Headquarters</h3>
              <p className='text-sm text-slate-600'>000, P.O Khas, Langriali, Sialkot, Pakistan</p>
              <p className='text-sm text-slate-600'>Branch: Al Quoz, Sharjah, UAE</p>
            </div>
          </div>
          <div className='flex gap-4'>
            <Phone className='text-blue-600 shrink-0' />
            <div>
              <h3 className='font-bold'>Phone / WhatsApp</h3>
              <a href='https://wa.me/923273961505' className='text-sm text-blue-600'>+92-327-3961505</a>
            </div>
          </div>
          <div className='flex gap-4'>
            <Mail className='text-blue-600 shrink-0' />
            <div>
              <h3 className='font-bold'>Email</h3>
              <p className='text-sm text-slate-600'>info@surgimart.com</p>
            </div>
          </div>
          <div className='flex gap-4'>
            <Clock className='text-blue-600 shrink-0' />
            <div>
              <h3 className='font-bold'>Business Hours</h3>
              <p className='text-sm text-slate-600'>Mon–Sat: 9AM – 6PM (PKT)</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 bg-slate-50 p-6 rounded-2xl'>
          <div><label htmlFor='name' className='text-sm font-medium block mb-1'>Name</label>
            <input id='name' {...register('name')} className='w-full border rounded-lg px-3 py-2.5 text-sm' />
            {errors.name && <p className='text-xs text-red-500'>{errors.name.message}</p>}</div>
          <div><label htmlFor='email' className='text-sm font-medium block mb-1'>Email</label>
            <input id='email' {...register('email')} type='email' className='w-full border rounded-lg px-3 py-2.5 text-sm' />
            {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}</div>
          <div><label htmlFor='subject' className='text-sm font-medium block mb-1'>Subject</label>
            <input id='subject' {...register('subject')} className='w-full border rounded-lg px-3 py-2.5 text-sm' />
            {errors.subject && <p className='text-xs text-red-500'>{errors.subject.message}</p>}</div>
          <div><label htmlFor='message' className='text-sm font-medium block mb-1'>Message</label>
            <textarea id='message' {...register('message')} rows={4} className='w-full border rounded-lg px-3 py-2.5 text-sm' />
            {errors.message && <p className='text-xs text-red-500'>{errors.message.message}</p>}</div>
          <button type='submit' disabled={loading} className='w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50'>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  )
}
