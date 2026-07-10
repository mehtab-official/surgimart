'use client'
import { useState } from 'react'
import { useCartStore, useCurrencyStore } from '@/store'
import { ShippingStep } from '@/components/checkout/ShippingStep'
import { PaymentStep, type PaymentMethod } from '@/components/checkout/PaymentStep'
import { ConfirmStep } from '@/components/checkout/ConfirmStep'
import Image from 'next/image'
import type { ShippingData } from '@/types'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [shippingData, setShippingData] = useState<ShippingData | null>(null)
  const [orderNumber, setOrderNumber] = useState('')
  const [isPlacing, setIsPlacing] = useState(false)
  const { items, clearCart } = useCartStore()
  const { convert, currency } = useCurrencyStore()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = subtotal >= 150 ? 0 : 15
  const total = subtotal + shipping

  function handleShippingComplete(data: ShippingData) {
    setShippingData(data)
    setStep(2)
  }

  async function handlePaymentComplete(method: PaymentMethod) {
    if (!shippingData) return
    setIsPlacing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: items.map(i => ({ id: i.id, slug: i.slug, qty: i.qty, price: i.price })),
          shippingData,
          paymentMethod: method,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to place order')
      setOrderNumber(data.orderNumber)
      clearCart()
      sessionStorage.removeItem('surgimart-checkout-shipping')
      setStep(3)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order')
    } finally {
      setIsPlacing(false)
    }
  }

  const STEPS = ['Shipping', 'Payment', 'Confirmation']

  return (
    <section className='max-w-4xl mx-auto px-4 py-8'>
      <h1 className='font-lora text-3xl font-bold mb-8'>Checkout</h1>

      {/* Step Indicator */}
      <div data-testid='step-indicator' className='flex items-center gap-4 mb-8'>
        {STEPS.map((s, i) => (
          <div key={s} className='flex items-center gap-2'>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>{i + 1}</div>
            <span className={`text-sm font-medium ${step === i + 1 ? 'text-blue-600' : 'text-slate-500'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className='w-12 h-0.5 bg-slate-200' />}
          </div>
        ))}
      </div>

      <div className='grid md:grid-cols-3 gap-8'>
        {/* Main Content */}
        <div className='md:col-span-2'>
          {step === 1 && <ShippingStep onComplete={handleShippingComplete} />}
          {step === 2 && (
            <PaymentStep onComplete={handlePaymentComplete} />
          )}
          {step === 3 && <ConfirmStep orderNumber={orderNumber} />}

          {/* Loading overlay for order placement */}
          {isPlacing && (
            <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
              <div className='bg-white rounded-2xl p-8 text-center space-y-3'>
                <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto' />
                <p className='font-bold text-slate-800'>Placing your order...</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
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
            <div className='flex justify-between text-sm'><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `${currency} ${convert(shipping).toFixed(2)}`}</span></div>
            <div className='flex justify-between font-bold text-lg border-t pt-2'>
              <span>Total</span>
              <span>{currency} {convert(total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
