import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { Tag } from 'lucide-react'
import { CategoryFormModal } from '@/components/admin/CategoryFormModal'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-slate-800'>Categories</h2>
          <p className='text-slate-500'>Manage product categories and hierarchy.</p>
        </div>
        <CategoryFormModal />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {categories.map((cat) => (
          <div key={cat.id} className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between group'>
            <div className='flex items-center gap-4'>
              <div className='p-3 bg-blue-50 text-blue-600 rounded-xl'>
                <Tag size={24} />
              </div>
              <div>
                <h3 className='font-bold text-slate-800'>{cat.name}</h3>
                <p className='text-xs text-slate-500'>/{cat.slug}</p>
              </div>
            </div>
            <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
              <CategoryFormModal category={cat} isEdit />
              {/* Delete button could go here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
