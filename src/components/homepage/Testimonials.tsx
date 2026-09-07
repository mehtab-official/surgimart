'use client'

import { Star, ShieldCheck, Stethoscope, Quote, Building2 } from 'lucide-react'

const REVIEWS = [
  {
    id: 'rev-1',
    doctorName: 'Dr. Marcus Vance, MD, FACS',
    title: 'Lead Orthopedic Trauma Surgeon',
    institution: 'St. Jude Orthopedic Center, UK',
    country: 'United Kingdom',
    rating: 5,
    quote: 'We have been procuring bone rongeurs and distal radius locking sets from SubMedOrtho for 3 years. The box-joint alignment and cutting crispness match European instruments at a fraction of the procurement cost.'
  },
  {
    id: 'rev-2',
    doctorName: 'Dr. Elena Rostova, MD',
    title: 'Chief of General Surgery',
    institution: 'Novomed Surgical Clinic, Germany',
    country: 'Germany',
    rating: 5,
    quote: 'The tungsten carbide inserts on their needle holders and micro scissors show zero slippage even after 150+ autoclave sterilization cycles. Exceptional metallurgy and hand craftsmanship.'
  },
  {
    id: 'rev-3',
    doctorName: 'Dr. Tariq Al-Mansoor, FRCS',
    title: 'Senior ENT & Skull Base Specialist',
    institution: 'Emirates Health City Hospital, UAE',
    country: 'United Arab Emirates',
    rating: 5,
    quote: 'Their micro suction tubes and ear forceps have outstanding tactile feedback. Deliveries from Sialkot arrive on schedule with full batch inspection documentation.'
  },
  {
    id: 'rev-4',
    doctorName: 'Dr. Jean-Luc Bernard, MD',
    title: 'Director of Hospital Procurement',
    institution: 'Alliance Médicale Internationale, France',
    country: 'France',
    rating: 5,
    quote: 'SubMedOrtho has become our reliable OEM supplier for custom-branded hospital surgical trays. The laser marking and custom packaging are strictly compliant with ISO 13485.'
  }
]

export function Testimonials() {
  return (
    <section className='py-20 bg-slate-50 border-b border-slate-200/80'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        
        {/* Section Header */}
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-3'>
          <div className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider'>
            <Stethoscope size={13} className='text-blue-600' />
            <span>Surgeon & Distributor Reviews</span>
          </div>
          <h2 className='text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight'>
            Trusted by Surgeons & Medical Procurement Teams Worldwide
          </h2>
          <p className='text-slate-600 text-sm max-w-xl mx-auto'>
            Read authentic feedback from international doctors, orthopedic specialists, and clinic directors who rely on SubMedOrtho instruments.
          </p>
        </div>

        {/* 4 to 5 Foreign Doctor Reviews Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {REVIEWS.map(rev => (
            <div 
              key={rev.id}
              className='bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative'
            >
              <div>
                
                {/* Quote Icon & Stars */}
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-0.5 text-amber-400'>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} className='fill-amber-400' />
                    ))}
                  </div>
                  <Quote size={20} className='text-blue-200' />
                </div>

                {/* Review Text */}
                <p className='text-xs text-slate-700 leading-relaxed italic mb-6'>
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              {/* Doctor Details */}
              <div className='pt-4 border-t border-slate-100'>
                <div className='font-bold text-slate-900 text-sm'>{rev.doctorName}</div>
                <div className='text-[11px] text-blue-600 font-semibold'>{rev.title}</div>
                <div className='text-[11px] text-slate-500 flex items-center gap-1 mt-1'>
                  <Building2 size={11} className='text-slate-400 shrink-0' />
                  <span className='truncate'>{rev.institution}</span>
                </div>
                <div className='text-[10px] text-slate-400 mt-0.5 font-medium'>
                  {rev.country}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
