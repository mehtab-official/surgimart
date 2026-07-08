import { Shield, Award, Globe, Users } from 'lucide-react'

const STATS = [
  { icon: Users, value: '200K+', label: 'Medical Professionals' },
  { icon: Globe, value: '60+', label: 'Countries Served' },
  { icon: Award, value: 'ISO 9001', label: 'Certified Quality' },
  { icon: Shield, value: '25+', label: 'Years Experience' },
]

export function TrustStrip() {
  return (
    <section data-testid='trust-strip' className='bg-blue-600 text-white py-6'>
      <div className='max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6'>
        {STATS.map(stat => (
          <div key={stat.label} className='flex items-center gap-3'>
            <stat.icon size={28} className='text-blue-200' />
            <div>
              <p className='font-lora font-bold text-xl'>{stat.value}</p>
              <p className='text-xs text-blue-100'>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
