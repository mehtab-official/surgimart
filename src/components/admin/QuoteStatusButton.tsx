'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { CheckCircle2, Loader2 } from 'lucide-react'

export function QuoteStatusButton({ quoteId, currentStatus }: { quoteId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onMarkResponded() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'responded' }),
      })

      if (!res.ok) throw new Error('Failed')
      
      toast.success('Quote marked as responded')
      router.refresh()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  if (currentStatus === 'responded') {
    return (
      <div className='flex items-center gap-2 text-green-600 font-bold'>
        <CheckCircle2 size={20} />
        Responded
      </div>
    )
  }

  return (
    <button 
      onClick={onMarkResponded}
      disabled={loading}
      className='bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50'
    >
      {loading ? <Loader2 size={20} className='animate-spin' /> : <CheckCircle2 size={20} />}
      Mark as Responded
    </button>
  )
}
