'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  HelpCircle, 
  Package, 
  Truck, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface FAQItem {
  q: string
  a: string
}

interface FAQCategory {
  id: string
  title: string
  icon: any
  description: string
  questions: FAQItem[]
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'general',
    title: 'General Questions',
    icon: HelpCircle,
    description: 'Overview of SubMedOrtho, company background, and manufacturing capabilities.',
    questions: [
      {
        q: '1. What types of medical instruments does SubMedOrtho manufacture?',
        a: 'We specialize in precision surgical, orthopedic, ENT, and neuro-spinal instruments, as well as orthopedic trauma bone plating systems. Our products are engineered to meet the demanding requirements of healthcare professionals, clinics, and hospital distributors worldwide.'
      },
      {
        q: '2. Where is SubMedOrtho located?',
        a: 'Our company and manufacturing facilities are based in Sialkot, Pakistan — a city renowned worldwide for its generational expertise and global leadership in manufacturing high-quality surgical medical instruments.'
      },
      {
        q: '3. How long has SubMedOrtho been in business?',
        a: 'SubMedOrtho has over 15 years of continuous manufacturing experience in the surgical instrument industry, combining traditional craftsmanship with modern CNC machinery and ISO quality frameworks.'
      },
      {
        q: '4. What is your manufacturing process?',
        a: 'We follow a rigorous multi-stage manufacturing sequence that includes certified metallurgical raw material selection (AISI 410, 420, 316L VM, and Titanium), drop forging, CNC precision milling, vacuum heat treatment, artisan hand-fitting, and multi-stage ultrasonic cleaning and passivation.'
      },
      {
        q: '5. How can I contact SubMedOrtho?',
        a: 'You can reach our export desk directly by email at submedortho@gmail.com, by phone/WhatsApp at +92 327 3961505, or through our online Request a Quote (RFQ) form. We also serve buyers through our established online marketplace channels.'
      }
    ]
  },
  {
    id: 'shipping',
    title: 'Shipping and Delivery Questions',
    icon: Truck,
    description: 'International freight logistics, customs requirements, and order tracking.',
    questions: [
      {
        q: '1. What are your shipping options?',
        a: 'We offer flexible international shipping options tailored to your order size and urgency, including Express Air Courier (DHL, FedEx, UPS) for sample/urgent orders (4–7 business days), dedicated Air Cargo from Sialkot Cargo Port (SKT), and Ocean Container Freight (FCL/LCL) for bulk hospital tenders.'
      },
      {
        q: '2. Do you ship internationally?',
        a: 'Yes, we ship globally to over 60+ countries across North America, Europe, the Middle East, Latin America, and Asia, adhering strictly to international customs guidelines, Certificate of Origin (COO) documentation, and commercial export standards from Pakistan.'
      },
      {
        q: '3. How long does it take to receive an order?',
        a: 'Delivery transit times depend on the selected shipping method and destination. Express air shipments typically arrive in 4–7 business days, while standard air cargo takes 7–12 days. For sea freight container shipments, transit times range between 25–35 days depending on the destination port.'
      },
      {
        q: '4. Can I track my order?',
        a: 'Yes, once your shipment is dispatched from our Sialkot facility, full real-time Air Waybill (AWB) or container tracking numbers and customs documentation are provided immediately so you can monitor progress door-to-door.'
      }
    ]
  },
  {
    id: 'quality',
    title: 'Quality and Compliance Questions',
    icon: ShieldCheck,
    description: 'ISO standards, sterilization guidelines, inspection checks, and warranty.',
    questions: [
      {
        q: '1. How do you ensure the quality of your products?',
        a: 'Every single instrument undergoes individual visual inspection, dimensional tolerance verification against digital CAD blueprints, Rockwell hardness testing (HRC), and mechanical articulation testing before final clean packaging and dispatch.'
      },
      {
        q: '2. Are your products sterilized before shipment?',
        a: 'Instruments are shipped clean, chemically passivated (ASTM A967), and unsterilized in protective packaging. Standard surgical instrument exports are supplied in this format so that clinical sterilization (autoclave, steam, or ETO) can be performed by the receiving medical facility according to their institutional protocols prior to surgical use.'
      },
      {
        q: '3. What is your return and satisfaction policy?',
        a: 'We stand behind the craftsmanship of every instrument we produce. If any item arrives with manufacturing defects or fails to meet specified dimensional standards, we provide immediate replacement or credit upon return notification.'
      },
      {
        q: '4. Do you provide ISO certificates and Mill Test Reports?',
        a: 'Yes, full ISO 9001:2015, ISO 13485:2016 compliance dossiers, Certificate of Conformity (COC), and raw material Mill Test Certificates (MTC) can be provided with wholesale and tender orders upon request.'
      }
    ]
  },
  {
    id: 'exhibitions',
    title: 'Exhibitions and Direct Engagement',
    icon: Calendar,
    description: 'Meeting our leadership at international medical trade fairs and expos.',
    questions: [
      {
        q: '1. Does SubMedOrtho participate in industry exhibitions?',
        a: 'Yes, our team attends major global healthcare exhibitions including MEDICA (Germany), World Health Expo / Arab Health (Dubai), Expomed Eurasia (Turkey), and FIME (Miami). You can review our upcoming exhibition schedule on our Events page.'
      },
      {
        q: '2. Can I contact your engineering team directly with custom specifications?',
        a: 'Absolutely. We regularly produce custom OEM instruments, customized surgical sets, laser-marked branding, and bespoke dimensional variations. Message us directly at submedortho@gmail.com or submit a request on our Quote page.'
      }
    ]
  }
]

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState<string>('general')
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  function toggleItem(key: string) {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const currentCategory = FAQ_CATEGORIES.find(c => c.id === activeTab) || FAQ_CATEGORIES[0]

  return (
    <div className='min-h-screen bg-slate-50'>
      
      {/* ── HERO BANNER WITH BACKGROUND IMAGE ── */}
      <section className='relative text-white py-16 sm:py-24 overflow-hidden bg-slate-950'>
        {/* Background Image & Adaptive Gradient Overlays - Darkened Text Zone */}
        <div className='absolute inset-0 z-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src='/images/image2.jpeg' 
            alt='SubMedOrtho Laparoscopic Instruments & Articulation' 
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
              <HelpCircle size={13} />
              <span>Knowledge Base & Support</span>
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6'>
              Frequently Asked <span className='text-blue-400'>Questions</span>
            </h1>
            <p className='text-lg sm:text-xl text-slate-300 font-medium leading-relaxed mb-8'>
              Clear answers regarding our surgical manufacturing in Sialkot, international export logistics, ISO compliance, and custom ordering.
            </p>
            <div className='flex flex-wrap gap-4'>
              <Link
                href='/quote'
                className='inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all'
              >
                Request a Formal Quote
              </Link>
              <Link
                href='/contact'
                className='inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 transition-all backdrop-blur-md'
              >
                Contact Export Desk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY SELECTOR & QUESTIONS ── */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-10'>
            
            {/* Left Column: Category Tabs */}
            <div className='lg:col-span-4 space-y-3'>
              <div className='text-xs font-bold uppercase tracking-wider text-slate-400 px-3'>
                FAQ Categories
              </div>

              {FAQ_CATEGORIES.map(cat => {
                const Icon = cat.icon
                const isActive = activeTab === cat.id

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`w-full flex items-start gap-3.5 p-4 rounded-2xl text-left transition-all duration-200 border ${
                      isActive 
                        ? 'bg-white border-blue-600 shadow-md text-blue-900 ring-2 ring-blue-600/10' 
                        : 'bg-white/80 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className='font-bold text-sm text-slate-900'>{cat.title}</div>
                      <div className='text-[11px] text-slate-500 line-clamp-1 mt-0.5'>{cat.description}</div>
                    </div>
                  </button>
                )
              })}

              {/* Direct Help Box */}
              <div className='pt-6'>
                <div className='p-6 rounded-2xl bg-slate-900 text-white space-y-3 shadow-xl'>
                  <h4 className='font-bold text-sm'>Have a specific inquiry?</h4>
                  <p className='text-xs text-slate-300 leading-relaxed'>
                    Our Sialkot technical and export desk is available to assist with custom quotes, sample orders, and tender documents.
                  </p>
                  <div className='space-y-2 pt-1 text-xs text-slate-300'>
                    <div className='flex items-center gap-2'>
                      <Phone size={13} className='text-blue-400' />
                      <span>+92 327 3961505</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Mail size={13} className='text-blue-400' />
                      <span>submedortho@gmail.com</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white'>IG</span>
                      <a 
                        href='https://www.instagram.com/submedortho' 
                        target='_blank' 
                        rel='noopener noreferrer' 
                        className='text-rose-400 hover:underline'
                      >
                        @submedortho
                      </a>
                    </div>
                  </div>
                  <div className='pt-2 flex flex-col gap-2'>
                    <Link
                      href='/quote'
                      className='inline-block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl transition-colors'
                    >
                      Request a Quote (RFQ)
                    </Link>
                    <a
                      href='https://www.instagram.com/submedortho'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-block w-full text-center bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-sm'
                    >
                      Instagram (@submedortho)
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Active Category Accordion */}
            <div className='lg:col-span-8 space-y-4'>
              
              <div className='bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6'>
                <h3 className='text-2xl font-extrabold text-slate-900'>
                  {currentCategory.title}
                </h3>
                <p className='text-xs text-slate-500 mt-1'>
                  {currentCategory.description}
                </p>
              </div>

              <div className='space-y-3'>
                {currentCategory.questions.map((item, idx) => {
                  const itemKey = `${currentCategory.id}-${idx}`
                  const isOpen = openItems[itemKey] ?? (idx === 0)

                  return (
                    <div 
                      key={idx}
                      className='bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all shadow-sm'
                    >
                      <button
                        onClick={() => toggleItem(itemKey)}
                        className='w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-900 hover:bg-slate-50/80 transition-colors'
                      >
                        <span className='pr-4'>{item.q}</span>
                        <ChevronDown 
                          size={18} 
                          className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} 
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className='overflow-hidden'
                          >
                            <div className='px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3'>
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  )
}
