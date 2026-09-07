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
        className={
          isEdit 
            ? 'p-2 text-slate-400 hover:text-amber-400 transition-colors' 
            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm shadow-lg shadow-amber-500/10'
        }
      >
        {isEdit ? <Edit2 size={16} /> : <><Plus size={18} /> Add Category</>}
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm'>
          <div className='bg-[#0a1426] border border-slate-800/90 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-slate-200'>
            <div className='p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60'>
              <div>
                <h3 className='font-bold text-white text-base'>{isEdit ? 'Edit Category' : 'New Product Category'}</h3>
                <p className='text-xs text-slate-400 mt-0.5'>Configure surgical discipline and directory slug</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className='p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors'
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={onSubmit} className='p-6 space-y-4'>
              <div>
                <label className='text-xs font-semibold text-slate-300 block mb-1.5'>Category / Discipline Name *</label>
                <input 
                  value={name}
                  onChange={onNameChange}
                  placeholder='e.g. Dental Surgery, Micro Neuro'
                  className='w-full bg-[#070e1e] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all'
                  required
                />
              </div>
              <div>
                <label className='text-xs font-semibold text-slate-300 block mb-1.5'>URL Slug *</label>
                <input 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder='dental-surgery'
                  className='w-full bg-[#070e1e]/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-300 placeholder:text-slate-600 focus:border-slate-600 outline-none'
                  required
                />
              </div>
              <div className='flex gap-3 pt-4 border-t border-slate-800/80'>
                <button 
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='flex-1 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors'
                >
                  Cancel
                </button>
                <button 
                  type='submit'
                  disabled={loading}
                  className='flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50'
                >
                  {loading ? <Loader2 size={16} className='animate-spin' /> : <Save size={16} />}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
