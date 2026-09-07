'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

interface BackButtonProps {
  label?: string
  fallbackUrl?: string
  className?: string
  variant?: 'light' | 'dark'
}

export function BackButton({ 
  label = 'Back', 
  fallbackUrl = '/',
  className = '',
  variant = 'light'
}: BackButtonProps) {
  const router = useRouter()

  function handleBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  const baseStyle = variant === 'dark'
    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm'
    : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-sm hover:shadow'

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-sm cursor-pointer ${baseStyle} ${className}`}
      aria-label={label}
    >
      <ChevronLeft size={16} className='shrink-0' />
      <span>{label}</span>
    </button>
  )
}
