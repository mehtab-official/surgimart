import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { Tag, ArrowLeft } from 'lucide-react'
import { CategoryFormModal } from '@/components/admin/CategoryFormModal'

const FALLBACK_CATEGORIES = [
  { id: 'cat-1', name: 'General Surgery', slug: 'general-surgery' },
  { id: 'cat-2', name: 'Orthopaedic', slug: 'orthopaedic' },
  { id: 'cat-3', name: 'Dental Instruments', slug: 'dental' },
  { id: 'cat-4', name: 'ENT Specialty', slug: 'ent' },
  { id: 'cat-5', name: 'Neuro & Spinal', slug: 'neuro-spinal' },
  { id: 'cat-6', name: 'Implants & Trauma', slug: 'implants-trauma' },
]

export default async function AdminCategoriesPage() {
  let categories: any[] = FALLBACK_CATEGORIES
  try {
    const dbCategories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    if (dbCategories && dbCategories.length > 0) {
      categories = dbCategories
    }
  } catch (err) {
    console.warn('Prisma DB query failed in AdminCategoriesPage, using default categories:', err)
  }

  return (
    <div className='space-y-6'>
      <Link href='/admin' className='inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors'>
        <ArrowLeft size={14} /> Back to Overview
      </Link>

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <span className='px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30'>
              Taxonomy & Classification
            </span>
            <span className='text-xs text-slate-400'>• {categories.length} Total Disciplines</span>
          </div>
          <h2 className='text-2xl font-bold text-white tracking-tight'>Product Categories</h2>
          <p className='text-slate-400 text-sm'>Manage instrument surgical disciplines and catalog hierarchy.</p>
        </div>
        <CategoryFormModal />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {categories.map((cat) => (
          <div key={cat.id} className='bg-[#0a1426] p-5 rounded-2xl border border-slate-800/80 shadow-md flex items-center justify-between group hover:border-slate-700 transition-colors'>
            <div className='flex items-center gap-3.5'>
              <div className='p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl'>
                <Tag size={20} />
              </div>
              <div>
                <h3 className='font-bold text-white text-sm'>{cat.name}</h3>
                <p className='text-xs text-slate-400 font-mono mt-0.5'>/{cat.slug}</p>
              </div>
            </div>
            <div className='flex items-center gap-1'>
              <CategoryFormModal category={cat} isEdit />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
