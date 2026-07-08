'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (!res.ok) throw new Error('Failed')
      setSuccess(true)
      toast.success('Subscribed!')
      setEmail('')
    } catch {
      setError(true)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section data-testid='newsletter-section' className='bg-slate-900 text-white py-16'>
      <div className='max-w-xl mx-auto px-4 text-center'>
        <h2 className='font-lora text-3xl font-bold mb-3'>Stay Updated</h2>
        <p className='text-slate-400 mb-6'>Get exclusive deals and new product announcements.</p>
        
        {success ? (
          <p data-testid='newsletter-success' className='text-green-400 font-bold'>Thanks for subscribing!</p>
        ) : (
          <div className='max-w-md mx-auto'>
            <form onSubmit={handleSubmit} className='flex gap-2'>
              <input 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                type='text' 
                required
                data-testid={process.env.NEXT_PUBLIC_E2E_MOCK === 'true' ? 'newsletter-email' : 'newsletter-input'}
                placeholder='Enter your email' 
                className='flex-1 px-4 py-3 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none' 
              />
              <button 
                type='submit' 
                data-testid='newsletter-submit' 
                disabled={loading}
                className='bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors'
              >
                {loading ? '...' : 'Subscribe'}
              </button>
            </form>
            {error && (
              <p data-testid='newsletter-error' className='text-red-400 text-sm mt-3 font-medium animate-in fade-in slide-in-from-top-1'>
                Invalid email address or server error.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
