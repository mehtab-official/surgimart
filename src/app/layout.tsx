import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Lora } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Providers } from './providers'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' })
const lora = Lora({ subsets: ['latin'], variable: '--font-lora', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'Submed Ortho — Premium Surgical Instruments', template: '%s | Submed Ortho' },
  description: 'ISO-certified surgical instruments from Sialkot, Pakistan. Trusted by 200K+ medical professionals in 60+ countries.',
  keywords: ['surgical instruments', 'medical supplies', 'Sialkot', 'wholesale surgical', 'dental instruments'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`${jakarta.variable} ${lora.variable}`}>
      <body className='font-jakarta antialiased min-h-screen flex flex-col'>
        <Providers>
          <Navbar />
          <main className='flex-1'>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
