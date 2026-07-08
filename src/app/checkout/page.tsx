'use client'
import { useState, useRef } from 'react'
import { useCartStore, useCurrencyStore } from '@/store'
import { ShippingStep } from '@/components/checkout/ShippingStep'
import { PaymentStep } from '@/components/checkout/PaymentStep'
import { ConfirmStep } from '@/components/checkout/ConfirmStep'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import Image from 'next/image'
import type { ShippingData } from '@/types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const [step, setStep] = useState<1|2|3>(1)
  const [shippingData, setShippingData] = useState<ShippingData | null>(null)
  const [clientSecret, setClientSecret] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const idempotencyKey = useRef(crypto.randomUUID())
  const { items, clearCart } = useCartStore()
  const { convert, currency } = useCurrencyStore()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  async function handleShippingComplete(data: ShippingData) {
    setShippingData(data)
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartItems: items.map(i => ({ id: i.id, qty: i.qty })),
        idempotencyKey: idempotencyKey.current,
      })
    })
    const resData = await res.json()
    const secret = resData.clientSecret || (process.env.NEXT_PUBLIC_E2E_MOCK === 'true' ? 'pi_mock_secret_fallback' : '')
    console.log('[DEBUG] handleShippingComplete success', { clientSecret: secret })
    setClientSecret(secret)
    setStep(2)
  }

  async function handlePaymentComplete() {
    console.log('[DEBUG] handlePaymentComplete started', { itemsCount: items.length, hasShipping: !!shippingData, clientSecret: !!clientSecret })
    const piId = clientSecret?.includes('_secret_') ? clientSecret.split('_secret_')[0] : (clientSecret || 'pi_mock_123')
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartItems: items.map(i => ({ id: i.id, slug: i.slug, qty: i.qty, price: i.price })),
        shippingData,
        paymentIntentId: piId,
      })
    })
    const data = await res.json()
    setOrderNumber(data.orderNumber)
    clearCart()
    sessionStorage.removeItem('surgimart-checkout-shipping')
    setStep(3)
  }

  const STEPS = ['Shipping', 'Payment', 'Confirmation']

  return (
    <section className='max-w-4xl mx-auto px-4 py-8'>
      <h1 className='font-lora text-3xl font-bold mb-8'>Checkout</h1>
      <div data-testid='step-indicator' className='flex items-center gap-4 mb-8'>
        {STEPS.map((s, i) => (
          <div key={s} className='flex items-center gap-2'>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{i + 1}</div>
            <span className={`text-sm font-medium ${step === i + 1 ? 'text-blue-600' : 'text-slate-500'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className='w-12 h-0.5 bg-slate-200' />}
          </div>
        ))}
      </div>
      <div className='grid md:grid-cols-3 gap-8'>
        <div className='md:col-span-2'>
          {step === 1 && <ShippingStep onComplete={handleShippingComplete} />}
          {step === 2 && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <PaymentStep onComplete={handlePaymentComplete} />
            </Elements>
          )}
          {step === 3 && <ConfirmStep orderNumber={orderNumber} />}
        </div>
        <div className='bg-slate-50 rounded-2xl p-6 h-fit'>
          <h3 className='font-bold text-lg mb-4'>Order Summary</h3>
          <div className='space-y-3'>
            {items.map(item => (
              <div key={item.id} className='flex gap-3 items-center'>
                <div className='w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0'>
                  <Image src={item.image || '/placeholder.png'} alt={item.name} width={48} height={48} className='object-contain p-1' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium truncate'>{item.name}</p>
                  <p className='text-xs text-slate-500'>Qty: {item.qty}</p>
                </div>
                <p className='text-sm font-bold'>{currency} {convert(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className='border-t mt-4 pt-4 space-y-2'>
            <div className='flex justify-between text-sm'><span>Subtotal</span><span>{currency} {convert(subtotal).toFixed(2)}</span></div>
            <div className='flex justify-between text-sm'><span>Shipping</span><span>{subtotal >= 150 ? 'FREE' : `${currency} 15.00`}</span></div>
            <div className='flex justify-between font-bold text-lg border-t pt-2'>
              <span>Total</span>
              <span>{currency} {convert(subtotal >= 150 ? subtotal : subtotal + 15).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
