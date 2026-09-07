import { ProductForm } from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewProductPage() {
  return (
    <div className='space-y-6 max-w-4xl'>
      <Link href='/admin/products' className='inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors'>
        <ArrowLeft size={14} /> Back to Instruments
      </Link>

      <div>
        <h2 className='text-2xl font-bold text-white tracking-tight'>Add New Instrument</h2>
        <p className='text-slate-400 text-sm'>Create a new surgical instrument listing for the export showcase catalog.</p>
      </div>

      <div className='bg-[#0a1426] p-6 rounded-2xl border border-slate-800/80 shadow-md text-slate-200'>
        <ProductForm />
      </div>
    </div>
  )
}
