'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  selectedCategory: string
  totalCount: number
}

const CATEGORIES = [
  'General Surgery',
  'Orthopaedic Instruments & Implants',
  'Implants & Locking Plates',
  'ENT Specialty Instruments',
  'Dental Surgery Instruments',
  'Neuro & Spinal Surgery',
  'Veterinary Surgical & Implants',
]

export function ProductCategoryFilter({ selectedCategory, totalCount }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (newCategory) {
      params.set('category', newCategory)
    } else {
      params.delete('category')
    }
    params.set('page', '1')
    router.push(`/admin/products?${params.toString()}`)
  }

  return (
    <div className='flex items-center gap-2'>
      <select
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value)}
        className='bg-slate-900/80 text-white border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer'
      >
        <option value=''>All Categories ({totalCount})</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  )
}
