'use client'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

interface Props { orderNumber: string }

export function ConfirmStep({ orderNumber }: Props) {
  return (
    <div className='text-center py-12 space-y-6'>
      <CheckCircle2 size={64} className='mx-auto text-green-500' />
      <div>
        <h2 className='font-lora text-2xl font-bold text-slate-900'>Order Confirmed!</h2>
        <p data-testid='order-number' className='text-lg text-blue-600 font-bold mt-2'>{orderNumber}</p>
      </div>
      <p className='text-slate-600'>A confirmation email has been sent to your address.</p>
      <div className='flex flex-col sm:flex-row gap-3 justify-center'>
        <Link href={`/track-order?order=${orderNumber}`}
          className='bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700'>Track Order</Link>
        <Link href='/shop' className='border-2 border-blue-600 text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50'>Continue Shopping</Link>
      </div>
    </div>
  )
}
