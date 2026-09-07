'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, Building2, Globe2, Instagram } from 'lucide-react'
import toast from 'react-hot-toast'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid work email is required'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Please provide more details (at least 10 characters)'),
})

type ContactData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactData>({ 
    resolver: zodResolver(contactSchema) 
  })

  async function onSubmit(data: ContactData) {
    setLoading(true)
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || 'N/A',
          company: 'General Inquiry',
          country: 'Global',
          items: data.subject,
          quantity: 'Direct Inquiry',
          message: data.message
        })
      })

      if (!res.ok) throw new Error('Failed to send')
      setSubmitted(true)
      toast.success('Message sent to SubMedOrtho!')
      reset()
    } catch { 
      toast.error('Failed to send message. Please email submedortho@gmail.com directly.') 
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      
      {/* ── HERO BANNER WITH BACKGROUND IMAGE ── */}
      <section className='relative text-white py-16 sm:py-24 overflow-hidden bg-slate-950'>
        {/* Background Image & Adaptive Gradient Overlays - Darkened Text Zone */}
        <div className='absolute inset-0 z-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src='/images/image1.png' 
            alt='SubMedOrtho Precision Surgical Instrument Contacts' 
            className='w-full h-full object-cover object-right-top sm:object-center opacity-65 filter brightness-105 contrast-110'
          />
          {/* Left Scrim: Solid dark protection behind text side, fading into bright image on right */}
          <div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 via-45% to-slate-950/25' />
          <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50' />
          <div className='absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15' />
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 relative z-10'>
          <div className='mb-6'>
            <Link 
              href='/'
              className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors'
            >
              ← Back to Home
            </Link>
          </div>

          <div className='max-w-3xl'>
            <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-400/30 backdrop-blur-md'>
              <MessageSquare size={13} />
              <span>Direct Communication Desk</span>
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6'>
              Contact <span className='text-blue-400'>SubMedOrtho</span>
            </h1>
            <p className='text-lg sm:text-xl text-slate-300 font-medium leading-relaxed mb-8'>
              Connect with our Sialkot manufacturing leadership and export sales team for general inquiries, catalogue requests, or custom OEM production.
            </p>
            <div className='flex flex-wrap gap-3 text-xs font-semibold text-slate-200'>
              <a href='tel:+923273961505' className='px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold hover:bg-amber-500/30 transition-colors'>
                +92 327 3961505
              </a>
              <a href='mailto:submedortho@gmail.com' className='px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:text-white transition-colors'>
                submedortho@gmail.com
              </a>
              <a href='https://pk.linkedin.com/in/submed-ortho-47439a425' target='_blank' rel='noopener noreferrer' className='px-4 py-2 rounded-xl bg-[#0A66C2]/30 text-sky-200 border border-[#0A66C2]/40 hover:text-white transition-colors flex items-center gap-1.5'>
                <svg className='w-3 h-3 fill-current' viewBox='0 0 24 24'>
                  <path d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z' />
                </svg>
                <span>LinkedIn</span>
              </a>
              <a href='https://www.instagram.com/submedortho' target='_blank' rel='noopener noreferrer' className='px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:text-white transition-colors'>
                @submedortho
              </a>
              <span className='px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-400'>
                Sialkot, Pakistan Hub
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT GRID ── */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-start'>
            
            {/* Left: Contact Info Cards */}
            <div className='lg:col-span-5 space-y-6'>
              <div className='bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6'>
                <div>
                  <span className='text-xs font-bold uppercase tracking-wider text-blue-600'>
                    Sialkot Export Headquarters
                  </span>
                  <h3 className='text-2xl font-extrabold text-slate-900 mt-1'>
                    Get in Touch Directly
                  </h3>
                </div>

                <div className='space-y-4 text-xs text-slate-600'>
                  
                  {/* Phone */}
                  <div className='p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5'>
                    <div className='w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shrink-0'>
                      <Phone size={18} />
                    </div>
                    <div>
                      <div className='font-bold text-slate-900 text-sm'>Phone / WhatsApp</div>
                      <a href='tel:+923273961505' className='text-blue-600 hover:underline font-semibold text-xs mt-0.5 block'>
                        +92 327 3961505
                      </a>
                      <div className='text-[11px] text-slate-400 mt-0.5'>Mon–Sat: 9:00 AM – 6:00 PM (PKT / GMT+5)</div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className='p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5'>
                    <div className='w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shrink-0'>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div className='font-bold text-slate-900 text-sm'>Official Email</div>
                      <a href='mailto:submedortho@gmail.com' className='text-blue-600 hover:underline font-semibold text-xs mt-0.5 block'>
                        submedortho@gmail.com
                      </a>
                      <div className='text-[11px] text-slate-400 mt-0.5'>Formal quotes & tender responses in &lt; 24h</div>
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className='p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-3.5'>
                    <div className='w-9 h-9 rounded-xl bg-[#0A66C2] flex items-center justify-center text-white shrink-0 shadow-sm'>
                      <svg className='w-4 h-4 fill-current' viewBox='0 0 24 24'>
                        <path d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z' />
                      </svg>
                    </div>
                    <div>
                      <div className='font-bold text-slate-900 text-sm'>Official LinkedIn</div>
                      <a 
                        href='https://pk.linkedin.com/in/submed-ortho-47439a425' 
                        target='_blank' 
                        rel='noopener noreferrer'
                        className='text-[#0A66C2] hover:underline font-bold text-xs mt-0.5 block'
                      >
                        Submed Ortho on LinkedIn
                      </a>
                      <div className='text-[11px] text-slate-500 mt-0.5'>B2B export inquiries & company credentials</div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className='p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-rose-50 border border-pink-100 flex items-start gap-3.5'>
                    <div className='w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm'>
                      <Instagram size={18} />
                    </div>
                    <div>
                      <div className='font-bold text-slate-900 text-sm'>Official Instagram</div>
                      <a 
                        href='https://www.instagram.com/submedortho' 
                        target='_blank' 
                        rel='noopener noreferrer'
                        className='text-rose-600 hover:text-rose-700 font-bold text-xs mt-0.5 block'
                      >
                        @submedortho
                      </a>
                      <div className='text-[11px] text-slate-500 mt-0.5'>Follow for instrument showcase videos & stories</div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className='p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5'>
                    <div className='w-9 h-9 rounded-xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-600 shrink-0'>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className='font-bold text-slate-900 text-sm'>Manufacturing Facility</div>
                      <div className='text-xs text-slate-700 mt-0.5'>
                        Sialkot Industrial Zone, Punjab, Pakistan
                      </div>
                      <div className='text-[11px] text-slate-400 mt-0.5'>Sialkot Chamber of Commerce & Industry (SCCI) Member</div>
                    </div>
                  </div>

                </div>

                {/* Direct Action Buttons: WhatsApp + LinkedIn + Instagram */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2'>
                  <a
                    href='https://wa.me/923273961505'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 rounded-xl transition-colors shadow-md text-center'
                  >
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href='https://pk.linkedin.com/in/submed-ortho-47439a425'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center justify-center gap-1.5 bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md text-center'
                  >
                    <svg className='w-3.5 h-3.5 fill-current' viewBox='0 0 24 24'>
                      <path d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z' />
                    </svg>
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href='https://www.instagram.com/submedortho'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md text-center'
                  >
                    <Instagram size={14} />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className='lg:col-span-7'>
              <div className='bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm'>
                
                {submitted ? (
                  <div className='text-center py-12 space-y-4'>
                    <div className='w-16 h-16 mx-auto rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600'>
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className='text-2xl font-bold text-slate-900'>Message Delivered!</h3>
                    <p className='text-xs text-slate-600 max-w-sm mx-auto'>
                      Thank you for contacting SubMedOrtho. Our export team in Sialkot will respond to your email promptly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className='bg-blue-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl'
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                    <div>
                      <h3 className='text-xl font-bold text-slate-900 mb-1'>Send Us a Direct Inquiry</h3>
                      <p className='text-xs text-slate-500 mb-4'>We respond within 24 business hours.</p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-xs font-bold text-slate-700 mb-1'>Your Name *</label>
                        <input
                          {...register('name')}
                          placeholder='Dr. / Mr. / Ms.'
                          className='w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                        />
                        {errors.name && <p className='text-[11px] text-red-500 mt-1'>{errors.name.message}</p>}
                      </div>

                      <div>
                        <label className='block text-xs font-bold text-slate-700 mb-1'>Email Address *</label>
                        <input
                          type='email'
                          {...register('email')}
                          placeholder='name@domain.com'
                          className='w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                        />
                        {errors.email && <p className='text-[11px] text-red-500 mt-1'>{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-xs font-bold text-slate-700 mb-1'>Phone / WhatsApp (Optional)</label>
                        <input
                          {...register('phone')}
                          placeholder='+92 ...'
                          className='w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                        />
                      </div>

                      <div>
                        <label className='block text-xs font-bold text-slate-700 mb-1'>Inquiry Subject *</label>
                        <input
                          {...register('subject')}
                          placeholder='Product Catalogue / Custom Quotation / General'
                          className='w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                        />
                        {errors.subject && <p className='text-[11px] text-red-500 mt-1'>{errors.subject.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className='block text-xs font-bold text-slate-700 mb-1'>Your Message *</label>
                      <textarea
                        rows={4}
                        {...register('message')}
                        placeholder='Please describe your inquiry, instrument models needed, or target destination...'
                        className='w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                      />
                      {errors.message && <p className='text-[11px] text-red-500 mt-1'>{errors.message.message}</p>}
                    </div>

                    <button
                      type='submit'
                      disabled={loading}
                      className='w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50'
                    >
                      <Send size={14} />
                      <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
