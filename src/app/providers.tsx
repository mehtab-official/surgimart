'use client'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { ComparisonBar } from '@/components/product/ComparisonBar'
import { CookieBanner } from '@/components/ui/CookieBanner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ComparisonBar />
      <CookieBanner />
      <Toaster position='top-right' toastOptions={{
        style: { background: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '14px' }
      }} />
    </SessionProvider>
  )
}
