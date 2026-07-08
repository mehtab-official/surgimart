'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export function WholesaleStatusActions({ appId, currentStatus }: { appId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')
  const router = useRouter()

  async function onUpdate(status: 'approved' | 'rejected') {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/wholesale/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, message: note }),
      })

      if (!res.ok) throw new Error('Failed')
      
      toast.success(`Application ${status}`)
      router.refresh()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  if (currentStatus !== 'pending') return null

  return (
    <div className='flex flex-col gap-3 items-end'>
      <textarea 
        placeholder='Add a note for the customer...'
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className='border rounded-lg p-2 text-sm w-64'
        rows={2}
      />
      <div className='flex items-center gap-3'>
        <button 
          onClick={() => onUpdate('rejected')}
          disabled={loading}
          className='bg-red-50 text-red-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 transition-colors disabled:opacity-50'
        >
          {loading ? <Loader2 size={20} className='animate-spin' /> : <XCircle size={20} />}
          Reject
        </button>
        <button 
          onClick={() => onUpdate('approved')}
          disabled={loading}
          className='bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50'
        >
          {loading ? <Loader2 size={20} className='animate-spin' /> : <CheckCircle2 size={20} />}
          Approve
        </button>
      </div>
    </div>
  )
}
