'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, ArrowRight, ShieldCheck } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Automatically redirect to RFQ / Quote page since this is a showcase website
    const timer = setTimeout(() => {
      router.push('/quote')
    }, 2500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <section className='min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-950 text-slate-100'>
      <div className='max-w-lg w-full bg-[#0a1426] p-8 rounded-3xl border border-slate-800 shadow-2xl text-center'>
        <div className='w-16 h-16 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6'>
          <ShieldCheck size={32} />
        </div>
        
        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-amber-400 border border-slate-700 mb-4'>
          B2B Showcase & Export Desk
        </div>
        
        <h1 className='text-2xl font-bold text-white mb-3'>Direct Inquiries & RFQ Only</h1>
        
        <p className='text-slate-400 text-sm leading-relaxed mb-6'>
          SubMedOrtho is an export showcase platform for international hospitals and distributors. Retail checkout is replaced with wholesale RFQs and custom volume quotations.
        </p>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
          <Link
            href='/quote'
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/20'
          >
            <FileText size={16} />
            Request Bulk Quote (RFQ)
            <ArrowRight size={16} />
          </Link>
          <Link
            href='/shop'
            className='w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors'
          >
            Browse Instruments
          </Link>
        </div>

        <p className='text-[11px] text-slate-400 mt-6'>
          Redirecting automatically to the Quote Request Desk in a moment...
        </p>
      </div>
    </section>
  )
}
