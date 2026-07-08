'use client'
import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export function ProductTableActions({ productId }: { productId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function onDelete() {
    if (!confirm('Are you sure you want to delete this product?')) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')

      toast.success('Product deleted successfully')
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete product')
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button 
      onClick={onDelete}
      disabled={isDeleting}
      className='p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50'
      title='Delete Product'
    >
      {isDeleting ? <Loader2 size={18} className='animate-spin' /> : <Trash2 size={18} />}
    </button>
  )
}
