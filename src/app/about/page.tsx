import { Award, Users, Globe, Factory, Shield, Truck } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Submed Ortho — ISO-certified surgical instruments crafted in Sialkot, Pakistan. Trusted by 200K+ medical professionals in 60+ countries.',
}

export default function AboutPage() {
  return (
    <section className='max-w-7xl mx-auto px-4 py-16'>
      <div className='text-center mb-16'>
        <h1 className='font-lora text-4xl font-bold mb-4'>About Submed Ortho</h1>
        <p className='text-lg text-slate-600 max-w-2xl mx-auto'>
          World-class surgical instruments crafted in Sialkot, Pakistan — the global hub of surgical manufacturing since 1890.
        </p>
      </div>
      <div className='grid md:grid-cols-3 gap-8 mb-16'>
        {[
          { icon: Factory, title: 'Made in Sialkot', desc: 'Every instrument is crafted in our ISO-certified facility at 000, P.O Khas, Langriali, Sialkot — manufacturing medical and dental instruments and supplies.' },
          { icon: Award, title: 'ISO 9001:2015', desc: 'Our manufacturing processes meet the highest standards of quality management. CE and FDA documentation available.' },
          { icon: Globe, title: '60+ Countries', desc: 'Trusted by medical professionals across 6 continents. Direct exports to hospitals, clinics, and distributors.' },
          { icon: Users, title: '200K+ Professionals', desc: 'From solo practitioners to hospital chains, our instruments serve diverse medical needs worldwide.' },
          { icon: Shield, title: '25+ Years', desc: 'Over two decades of expertise in precision instrument manufacturing, combining traditional craftsmanship with modern tech.' },
          { icon: Truck, title: 'Global Shipping', desc: 'Fast, insured shipping with real-time tracking. Free delivery on orders over $150.' },
        ].map(item => (
          <div key={item.title} className='bg-white border border-slate-100 rounded-2xl p-6'>
            <item.icon size={32} className='text-blue-600 mb-3' />
            <h3 className='font-bold text-lg mb-2'>{item.title}</h3>
            <p className='text-sm text-slate-600'>{item.desc}</p>
          </div>
        ))}
      </div>
      <div className='bg-blue-50 rounded-2xl p-8 text-center'>
        <h2 className='font-lora text-2xl font-bold mb-3'>Our Mission</h2>
        <p className='text-slate-700 max-w-2xl mx-auto'>
          To democratize access to premium surgical instruments by combining Pakistan&apos;s world-renowned craftsmanship
          with modern eCommerce, making ISO-certified tools available to every medical professional at fair prices.
        </p>
      </div>
    </section>
  )
}
