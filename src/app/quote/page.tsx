'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Send, 
  CheckCircle2, 
  FileText, 
  Package, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Globe2, 
  Phone, 
  Mail, 
  MapPin,
  Instagram 
} from 'lucide-react'
import toast from 'react-hot-toast'

const quoteSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid work email is required'),
  phone: z.string().min(5, 'Phone / WhatsApp is required'),
  organization: z.string().min(2, 'Clinic or Company name is required'),
  country: z.string().min(2, 'Country is required'),
  orderType: z.enum(['Standard Wholesale', 'Custom OEM / Private Label', 'Hospital Tender', 'Sample Order']),
  volumeTier: z.string().min(1, 'Please select estimated volume'),
  productCategories: z.array(z.string()).min(1, 'Select at least one product category'),
  notes: z.string().min(10, 'Please describe product models, quantities, or custom requirements'),
})

type QuoteFormData = z.infer<typeof quoteSchema>

const CATEGORIES_LIST = [
  'General Surgery (Forceps, Clamps, Scissors, Retractors)',
  'Orthopedic Trauma & Bone Rongeurs',
  'Titanium & 316L Bone Locking Plates & Screws',
  'ENT Diagnostic & Micro Tools',
  'Neuro / Spinal Surgery Sets',
  'Dental Surgery & Extraction Instruments',
  'Custom OEM Set / Bespoke Blueprints'
]

const VOLUME_TIERS = [
  'Sample / Trial Order (1–10 units)',
  'Small Wholesale (10–50 units)',
  'Commercial Distributor (50–200 units)',
  'Bulk Hospital Tender (200+ units)'
]

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      orderType: 'Standard Wholesale',
      productCategories: [],
      volumeTier: 'Commercial Distributor (50–200 units)'
    }
  })

  const selectedCategories = watch('productCategories') || []

  function toggleCategory(cat: string) {
    if (selectedCategories.includes(cat)) {
      setValue('productCategories', selectedCategories.filter(c => c !== cat))
    } else {
      setValue('productCategories', [...selectedCategories, cat])
    }
  }

  async function onSubmit(data: QuoteFormData) {
    setLoading(true)
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          company: data.organization,
          country: data.country,
          items: data.productCategories.join(', '),
          quantity: data.volumeTier,
          message: `Order Type: ${data.orderType}\nNotes: ${data.notes}`
        })
      })

      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
      toast.success('Quotation request sent successfully!')
    } catch {
      toast.error('Unable to send quote request. Please try again or email us directly.')
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
            src='/images/image2.jpeg' 
            alt='SubMedOrtho Precision Laparoscopic & Surgical Instruments' 
            className='w-full h-full object-cover object-right sm:object-center opacity-65 filter brightness-105 contrast-110'
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
              <FileText size={13} />
              <span>Direct Manufacturer Pricing & Export Inquiries</span>
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6'>
              Request a <span className='text-blue-400'>Quotation (RFQ)</span>
            </h1>
            <p className='text-lg sm:text-xl text-slate-300 font-medium leading-relaxed mb-8'>
              Get wholesale volume rates, custom OEM laser branding, and freight estimates directly from our factory in Sialkot, Pakistan. Response guaranteed within 24 hours.
            </p>
            <div className='flex flex-wrap gap-3 text-xs font-semibold text-slate-200'>
              <span className='px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-sm'>Direct Sialkot Factory Rates</span>
              <span className='px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-sm'>Free Sample Evaluation</span>
              <span className='px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-sm'>Door-to-Door Worldwide Delivery</span>
              <span className='px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 backdrop-blur-md border border-amber-500/30 font-bold'>ISO 13485 & CE Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-start'>
            
            {/* Left Column: Form */}
            <div className='lg:col-span-8'>
              <div className='bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm'>
                
                {submitted ? (
                  <div className='text-center py-16 space-y-4'>
                    <div className='w-20 h-20 mx-auto rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600'>
                      <CheckCircle2 size={40} />
                    </div>
                    <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900'>
                      Quotation Request Received!
                    </h2>
                    <p className='text-sm text-slate-600 max-w-md mx-auto leading-relaxed'>
                      Thank you. Our Sialkot engineering and export sales desk will review your specifications and send a formal commercial proposal within 24 hours.
                    </p>
                    <div className='pt-6'>
                      <button
                        onClick={() => setSubmitted(false)}
                        className='bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors'
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                    
                    <div>
                      <h3 className='text-xl font-bold text-slate-900 mb-1'>
                        1. Contact & Organization Details
                      </h3>
                      <p className='text-xs text-slate-500 mb-6'>
                        Provide your commercial and shipping contact information.
                      </p>

                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-xs font-bold text-slate-700 mb-1.5'>
                            Full Name *
                          </label>
                          <input
                            {...register('fullName')}
                            placeholder='Dr. John Smith / Jane Doe'
                            className='w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                          />
                          {errors.fullName && <p className='text-[11px] text-red-500 mt-1'>{errors.fullName.message}</p>}
                        </div>

                        <div>
                          <label className='block text-xs font-bold text-slate-700 mb-1.5'>
                            Business Email *
                          </label>
                          <input
                            type='email'
                            {...register('email')}
                            placeholder='procurement@hospital.com'
                            className='w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                          />
                          {errors.email && <p className='text-[11px] text-red-500 mt-1'>{errors.email.message}</p>}
                        </div>

                        <div>
                          <label className='block text-xs font-bold text-slate-700 mb-1.5'>
                            Phone / WhatsApp *
                          </label>
                          <input
                            {...register('phone')}
                            placeholder='+1 234 567 8900'
                            className='w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                          />
                          {errors.phone && <p className='text-[11px] text-red-500 mt-1'>{errors.phone.message}</p>}
                        </div>

                        <div>
                          <label className='block text-xs font-bold text-slate-700 mb-1.5'>
                            Company / Hospital Name *
                          </label>
                          <input
                            {...register('organization')}
                            placeholder='Global Medical Supplies Ltd.'
                            className='w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                          />
                          {errors.organization && <p className='text-[11px] text-red-500 mt-1'>{errors.organization.message}</p>}
                        </div>

                        <div className='sm:col-span-2'>
                          <label className='block text-xs font-bold text-slate-700 mb-1.5'>
                            Destination Country / Region *
                          </label>
                          <input
                            {...register('country')}
                            placeholder='e.g. United Kingdom, Germany, United States, UAE'
                            className='w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                          />
                          {errors.country && <p className='text-[11px] text-red-500 mt-1'>{errors.country.message}</p>}
                        </div>
                      </div>
                    </div>

                    <div className='border-t border-slate-100 pt-8'>
                      <h3 className='text-xl font-bold text-slate-900 mb-1'>
                        2. Procurement Requirements
                      </h3>
                      <p className='text-xs text-slate-500 mb-6'>
                        Select order scope and instrument categories needed.
                      </p>

                      <div className='space-y-4'>
                        <div>
                          <label className='block text-xs font-bold text-slate-700 mb-1.5'>
                            Inquiry Type
                          </label>
                          <select
                            {...register('orderType')}
                            className='w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium'
                          >
                            <option value='Standard Wholesale'>Standard Wholesale Instruments</option>
                            <option value='Custom OEM / Private Label'>Custom OEM / Laser Marking & Private Label</option>
                            <option value='Hospital Tender'>Government / Hospital Tender</option>
                            <option value='Sample Order'>Sample / Quality Evaluation Order</option>
                          </select>
                        </div>

                        <div>
                          <label className='block text-xs font-bold text-slate-700 mb-1.5'>
                            Estimated Order Volume
                          </label>
                          <select
                            {...register('volumeTier')}
                            className='w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium'
                          >
                            {VOLUME_TIERS.map(tier => (
                              <option key={tier} value={tier}>{tier}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className='block text-xs font-bold text-slate-700 mb-2'>
                            Select Product Categories *
                          </label>
                          <div className='space-y-2'>
                            {CATEGORIES_LIST.map(cat => {
                              const isChecked = selectedCategories.includes(cat)
                              return (
                                <button
                                  type='button'
                                  key={cat}
                                  onClick={() => toggleCategory(cat)}
                                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                                    isChecked
                                      ? 'bg-blue-50/70 border-blue-500 text-blue-900'
                                      : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  <span>{cat}</span>
                                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                                    isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                                  }`}>
                                    {isChecked && <CheckCircle2 size={13} />}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                          {errors.productCategories && (
                            <p className='text-[11px] text-red-500 mt-1'>{errors.productCategories.message}</p>
                          )}
                        </div>

                        <div>
                          <label className='block text-xs font-bold text-slate-700 mb-1.5'>
                            Product Models, Quantities & Specific Tolerances *
                          </label>
                          <textarea
                            rows={4}
                            {...register('notes')}
                            placeholder='Please list SKUs, instrument sizes (e.g. 14cm Kelly Forceps, 4mm Rongeurs), required steel grades (AISI 410/420), or OEM packaging needs...'
                            className='w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                          />
                          {errors.notes && <p className='text-[11px] text-red-500 mt-1'>{errors.notes.message}</p>}
                        </div>
                      </div>
                    </div>

                    <div className='pt-4'>
                      <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50'
                      >
                        <Send size={15} />
                        <span>{loading ? 'Submitting Request...' : 'Submit Quotation Request'}</span>
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </div>

            {/* Right Column: Trust Badges & Sialkot Direct Desk */}
            <div className='lg:col-span-4 space-y-6'>
              
              <div className='bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-xl'>
                <div>
                  <span className='text-[11px] font-bold uppercase tracking-wider text-blue-400'>
                    Direct Sialkot Factory Desk
                  </span>
                  <h4 className='text-xl font-extrabold text-white mt-1'>
                    SubMedOrtho Export Office
                  </h4>
                </div>

                <div className='space-y-4 text-xs text-slate-300'>
                  <div className='flex items-start gap-3'>
                    <Phone size={15} className='text-blue-400 shrink-0 mt-0.5' />
                    <div>
                      <div className='font-bold text-white'>Phone / WhatsApp</div>
                      <a href='tel:+923273961505' className='hover:text-blue-400'>+92 327 3961505</a>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <Mail size={15} className='text-blue-400 shrink-0 mt-0.5' />
                    <div>
                      <div className='font-bold text-white'>Export Inquiries Email</div>
                      <a href='mailto:submedortho@gmail.com' className='hover:text-blue-400'>submedortho@gmail.com</a>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center text-white shrink-0 mt-0.5'>
                      <svg className='w-2.5 h-2.5 fill-current' viewBox='0 0 24 24'>
                        <path d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z' />
                      </svg>
                    </div>
                    <div>
                      <div className='font-bold text-white'>Official LinkedIn</div>
                      <a 
                        href='https://pk.linkedin.com/in/submed-ortho-47439a425' 
                        target='_blank' 
                        rel='noopener noreferrer' 
                        className='text-sky-400 hover:underline font-semibold'
                      >
                        Submed Ortho (Verified B2B)
                      </a>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <Instagram size={15} className='text-rose-400 shrink-0 mt-0.5' />
                    <div>
                      <div className='font-bold text-white'>Instagram Account</div>
                      <a 
                        href='https://www.instagram.com/submedortho' 
                        target='_blank' 
                        rel='noopener noreferrer' 
                        className='text-rose-400 hover:underline font-semibold'
                      >
                        @submedortho
                      </a>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <MapPin size={15} className='text-rose-400 shrink-0 mt-0.5' />
                    <div>
                      <div className='font-bold text-white'>Manufacturing Hub</div>
                      <div>Sialkot, Punjab, Pakistan</div>
                    </div>
                  </div>
                </div>

                <div className='pt-2 space-y-2.5'>
                  <a
                    href='https://pk.linkedin.com/in/submed-ortho-47439a425'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center justify-center gap-2 w-full bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md text-center'
                  >
                    <svg className='w-4 h-4 fill-current' viewBox='0 0 24 24'>
                      <path d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z' />
                    </svg>
                    <span>Connect on LinkedIn</span>
                  </a>

                  <a
                    href='https://www.instagram.com/submedortho'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md text-center'
                  >
                    <Instagram size={14} />
                    <span>Follow @submedortho on Instagram</span>
                  </a>
                </div>

                <div className='pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400'>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 size={13} className='text-emerald-400' />
                    <span>ISO 9001:2015 & ISO 13485:2016</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 size={13} className='text-emerald-400' />
                    <span>Free sample evaluation on volume contracts</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 size={13} className='text-emerald-400' />
                    <span>Full Certificate of Origin (COO) support</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  )
}
