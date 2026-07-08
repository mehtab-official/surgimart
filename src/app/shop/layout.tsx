import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse our full catalog of premium surgical instruments and medical supplies.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
