'use client'
import { useState } from 'react'
import { Plus, Edit2, Loader2, Save, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  slug: string
}

export function CategoryFormModal({ category, isEdit }: { category?: Category, isEdit?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(category?.name || '')
  const [slug, setSlug] = useState(category?.slug || '')
  const router = useRouter()

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (!isEdit) {
      setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = isEdit && category ? `/api/admin/categories/${category.id}` : '/api/admin/categories'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      })

      if (!res.ok) throw new Error('Failed')

      toast.success(isEdit ? 'Category updated' : 'Category created')
      setIsOpen(false)
      router.refresh()
    } catch {
      toast.error('Operation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={isEdit ? 'p-2 text-slate-400 hover:text-blue-600 transition-colors' : 'bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors'}
      >
        {isEdit ? <Edit2 size={18} /> : <><Plus size={20} /> Add Category</>}
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden'>
            <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
              <h3 className='font-bold text-slate-800'>{isEdit ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => setIsOpen(false)} className='text-slate-400 hover:text-slate-600'><X size={20} /></button>
            </div>
            <form onSubmit={onSubmit} className='p-6 space-y-4'>
              <div>
                <label className='text-sm font-medium block mb-1'>Category Name</label>
                <input 
                  value={name}
                  onChange={onNameChange}
                  placeholder='e.g. Surgical Gloves'
                  className='w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20'
                  required
                />
              </div>
              <div>
                <label className='text-sm font-medium block mb-1'>Slug</label>
                <input 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className='w-full border rounded-lg px-3 py-2 text-sm bg-slate-50'
                  required
                />
              </div>
              <div className='flex gap-3 pt-4'>
                <button 
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='flex-1 px-4 py-2 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors'
                >
                  Cancel
                </button>
                <button 
                  type='submit'
                  disabled={loading}
                  className='flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50'
                >
                  {loading ? <Loader2 size={18} className='animate-spin' /> : <Save size={18} />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
