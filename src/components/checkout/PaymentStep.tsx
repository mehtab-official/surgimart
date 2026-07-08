'use client'
import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import toast from 'react-hot-toast'

interface Props { onComplete: () => void }

export function PaymentStep({ onComplete }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (process.env.NEXT_PUBLIC_E2E_MOCK !== 'true' && (!stripe || !elements)) return
    if (loading) return
    setLoading(true)
    try {
      if (process.env.NEXT_PUBLIC_E2E_MOCK === 'true') {
      console.log('[DEBUG] PaymentStep mock handlePay calling onComplete')
      onComplete()
      return
    }
      if (!stripe || !elements) return

      const { error } = await stripe.confirmPayment({
        elements: elements,
        redirect: 'if_required',
      })
      if (error) {
        toast.error(error.message || 'Payment failed')
      } else {
        onComplete()
      }
    } catch {
      toast.error('Payment failed')
    } finally {
      setLoading(false)
    }
  }

  if (process.env.NEXT_PUBLIC_E2E_MOCK === 'true') {
    return (
      <form data-testid='payment-form' onSubmit={handlePay} className='space-y-6'>
        <div className='p-4 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50'>
          <p className='text-sm text-blue-700 font-medium mb-4'>[E2E MOCK] Stripe Payment Element</p>
          <input data-testid='mock-card-number' placeholder='Card number' className='w-full border rounded-lg px-3 py-2 text-sm mb-3' defaultValue='4242 4242 4242 4242' />
          <div className='grid grid-cols-2 gap-3'>
            <input data-testid='mock-expiry' placeholder='MM / YY' className='border rounded-lg px-3 py-2 text-sm' defaultValue='12/29' />
            <input data-testid='mock-cvc' placeholder='CVC' className='border rounded-lg px-3 py-2 text-sm' defaultValue='123' />
          </div>
        </div>
        <button type='submit' data-testid='pay-btn'
          className='w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700'>
          Pay Now
        </button>
      </form>
    )
  }

  return (
    <form data-testid='payment-form' onSubmit={handlePay} className='space-y-6'>
      <PaymentElement />
      <button type='submit' disabled={!stripe || loading} data-testid='pay-btn'
        className='w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50'>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}
