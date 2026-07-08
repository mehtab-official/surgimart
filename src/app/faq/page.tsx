'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  { q: 'What countries do you ship to?', a: 'We ship to 60+ countries worldwide, including UAE, UK, USA, Germany, India, Saudi Arabia, Qatar, and more.' },
  { q: 'How long does shipping take?', a: 'Standard shipping takes 7-14 business days. Express shipping is available for select countries (3-5 days).' },
  { q: 'Do you offer wholesale pricing?', a: 'Yes! We offer volume discounts up to 40% off. Visit our Wholesale Portal to apply for a wholesale account.' },
  { q: 'Are all instruments ISO certified?', a: 'Yes. All Submed Ortho instruments are ISO 9001:2015 and CE certified. We also provide FDA 510(k) documentation on request.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day no-questions-asked return policy for unused instruments in original packaging.' },
  { q: 'Can I request a custom product catalog?', a: 'Absolutely. Contact our sales team via WhatsApp or email for a customized catalog based on your specialty.' },
  { q: 'Do you provide CE / FDA certifications with orders?', a: 'Yes. Certificates are included with every order. Additional documentation can be requested at no extra cost.' },
  { q: 'How do I track my order?', a: 'Visit our Track Order page and enter your order number and email to see real-time status updates.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, and bank transfers for wholesale orders.' },
  { q: 'How do I contact your team?', a: 'WhatsApp: +92-327-3961505. Email: info@submedortho.com. We respond within 2 hours during business hours.' },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className='max-w-3xl mx-auto px-4 py-16'>
      <h1 className='font-lora text-3xl font-bold text-center mb-3'>Frequently Asked Questions</h1>
      <p className='text-center text-slate-500 mb-12'>Everything you need to know about Submed Ortho</p>
      <div className='space-y-3'>
        {FAQS.map((faq, i) => (
          <div key={i} className='border border-slate-200 rounded-xl overflow-hidden'>
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className='w-full flex items-center justify-between p-4 text-left font-medium hover:bg-slate-50'>
              <span>{faq.q}</span>
              <ChevronDown size={18} className={`transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                  exit={{ height:0, opacity:0 }} className='overflow-hidden'>
                  <p className='px-4 pb-4 text-sm text-slate-600'>{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className='text-center mt-12'>
        <p className='text-slate-600 mb-3'>Still have questions?</p>
        <a href='https://wa.me/923273961505' target='_blank' rel='noopener noreferrer'
          className='bg-green-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-700 inline-block'>
          Chat on WhatsApp
        </a>
      </div>
    </section>
  )
}
