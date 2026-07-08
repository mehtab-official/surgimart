'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export function OrderStatusToggle({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

  async function onUpdate(newStatus: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error('Failed')
      
      setStatus(newStatus)
      toast.success('Order status updated')
      router.refresh()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm text-slate-500 font-medium'>Update Status:</span>
      <select 
        value={status}
        disabled={loading}
        onChange={(e) => onUpdate(e.target.value)}
        className='border rounded-lg px-3 py-1.5 text-sm font-bold bg-white focus:ring-2 focus:ring-blue-500/20'
      >
        {statuses.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
      </select>
      {loading && <Loader2 size={18} className='animate-spin text-blue-600' />}
    </div>
  )
}
