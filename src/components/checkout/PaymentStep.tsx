'use client'
import { useState } from 'react'
import { Banknote, Truck, Building2, Copy, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export type PaymentMethod = 'cod' | 'bank_transfer'

interface Props {
  onComplete: (method: PaymentMethod) => void
}

const BANK_DETAILS = {
  bankName: 'Meezan Bank',
  accountTitle: 'Submed Ortho',
  accountNumber: '0123456789',
  iban: 'PK00MEZN0001234567890',
  branch: 'Main Branch, Lahore',
}

export function PaymentStep({ onComplete }: Props) {
  const [selected, setSelected] = useState<PaymentMethod | null>(null)
  const [copied, setCopied] = useState(false)

  function copyIban() {
    navigator.clipboard.writeText(BANK_DETAILS.iban)
    setCopied(true)
    toast.success('IBAN copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-bold text-slate-800'>Select Payment Method</h2>

      {/* COD Option */}
      <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
        selected === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
      }`}>
        <input
          type='radio'
          name='payment'
          value='cod'
          className='mt-1 accent-blue-600'
          checked={selected === 'cod'}
          onChange={() => setSelected('cod')}
        />
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-1'>
            <Truck size={20} className='text-blue-600' />
            <span className='font-bold text-slate-800'>Cash on Delivery (COD)</span>
          </div>
          <p className='text-sm text-slate-500'>Pay in cash when your order is delivered. Available for select regions.</p>
        </div>
      </label>

      {/* Bank Transfer Option */}
      <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
        selected === 'bank_transfer' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
      }`}>
        <input
          type='radio'
          name='payment'
          value='bank_transfer'
          className='mt-1 accent-blue-600'
          checked={selected === 'bank_transfer'}
          onChange={() => setSelected('bank_transfer')}
        />
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-1'>
            <Building2 size={20} className='text-blue-600' />
            <span className='font-bold text-slate-800'>Bank Transfer</span>
          </div>
          <p className='text-sm text-slate-500'>Transfer payment to our bank account. Order will be processed after confirmation.</p>
        </div>
      </label>

      {/* Bank Details — shown when bank transfer is selected */}
      {selected === 'bank_transfer' && (
        <div className='bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3'>
          <div className='flex items-center gap-2 mb-3'>
            <Banknote size={18} className='text-blue-600' />
            <span className='font-bold text-slate-800'>Bank Account Details</span>
          </div>
          {[
            { label: 'Bank Name', value: BANK_DETAILS.bankName },
            { label: 'Account Title', value: BANK_DETAILS.accountTitle },
            { label: 'Account Number', value: BANK_DETAILS.accountNumber },
            { label: 'Branch', value: BANK_DETAILS.branch },
          ].map(({ label, value }) => (
            <div key={label} className='flex justify-between text-sm'>
              <span className='text-slate-500 font-medium'>{label}</span>
              <span className='font-bold text-slate-800'>{value}</span>
            </div>
          ))}
          <div className='flex justify-between items-center text-sm border-t border-slate-200 pt-3'>
            <span className='text-slate-500 font-medium'>IBAN</span>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-slate-800 font-mono'>{BANK_DETAILS.iban}</span>
              <button
                type='button'
                onClick={copyIban}
                className='p-1 hover:bg-slate-200 rounded transition-colors'
                title='Copy IBAN'
              >
                {copied ? <CheckCircle2 size={14} className='text-green-500' /> : <Copy size={14} className='text-slate-400' />}
              </button>
            </div>
          </div>
          <p className='text-xs text-amber-600 bg-amber-50 rounded-lg p-3 mt-2'>
            📌 Please use your order number as the payment reference. Your order will be confirmed within 24 hours after payment verification.
          </p>
        </div>
      )}

      <button
        type='button'
        disabled={!selected}
        onClick={() => selected && onComplete(selected)}
        data-testid='pay-btn'
        className='w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        {selected === 'cod' ? 'Place Order (Pay on Delivery)' : selected === 'bank_transfer' ? 'Place Order (Bank Transfer)' : 'Select a Payment Method'}
      </button>
    </div>
  )
}
