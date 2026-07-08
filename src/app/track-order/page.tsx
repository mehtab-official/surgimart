'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import type { Order } from '@/types'

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/orders?orderNumber=${orderNumber}&email=${email}`)
      if (!res.ok) { setError('Order not found'); setOrder(null) }
      else { setOrder(await res.json()); setError('') }
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  const STATUS_COLORS: Record<string, string> = {
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-yellow-100 text-yellow-700',
    delivered: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  }

  return (
    <section className='max-w-lg mx-auto px-4 py-16'>
      <h1 className='font-lora text-3xl font-bold text-center mb-3'>Track Your Order</h1>
      <p className='text-center text-slate-500 mb-8'>Enter your order number and email to check the status.</p>
      <form onSubmit={handleTrack} className='space-y-4'>
        <input value={orderNumber} onChange={e => setOrderNumber(e.target.value)} data-testid='track-order-number' placeholder='Order Number (e.g. SM-XXXX)' required className='w-full border rounded-lg px-3 py-2.5 text-sm' />
        <input value={email} onChange={e => setEmail(e.target.value)} data-testid='track-email' type='email' placeholder='Email Address' required className='w-full border rounded-lg px-3 py-2.5 text-sm' />
        <button type='submit' data-testid='track-submit' disabled={loading}
          className='w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2'>
          <Search size={16}/> {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>
      {error && <p data-testid='order-not-found' className='text-red-500 text-sm text-center mt-4'>{error}</p>}
      {order && (
        <div className='mt-8 bg-slate-50 rounded-2xl p-6 space-y-3'>
          <div className='flex justify-between items-center'>
            <h3 className='font-bold text-lg'>{order.orderNumber}</h3>
            <span data-testid='order-status' className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || ''}`}>{order.status}</span>
          </div>
          <p className='text-sm text-slate-600'>Total: ${order.total?.toFixed(2)}</p>
          {order.trackingNumber && <p className='text-sm text-slate-600'>Tracking: {order.trackingNumber}</p>}
          <p className='text-xs text-slate-400'>Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      )}
    </section>
  )
}
