'use client'

import Link from 'next/link'
import { Calendar, MapPin, Globe2, ArrowRight, ExternalLink, Sparkles } from 'lucide-react'

const EVENTS = [
  {
    id: 'arab-health',
    name: 'Arab Health Expo 2026',
    location: 'Dubai World Trade Centre, UAE',
    date: 'January 26 – 29, 2026',
    category: 'International Medical Trade Fair',
    image: '/images/implants-trauma-plates.jpg',
    description: 'Showcasing our precision orthopedic trauma plates, surgical bone rongeurs, and OEM manufacturing capabilities to Middle East & North Africa distributors.',
    booth: 'Booth: Z2.B19'
  },
  {
    id: 'medica',
    name: 'MEDICA Germany 2026',
    location: 'Düsseldorf Exhibition Centre, Germany',
    date: 'November 16 – 19, 2026',
    category: 'World Forum for Medicine',
    image: '/images/custom-surgical-kit.jpg',
    description: 'Meeting European healthcare procurement leaders, private label buyers, and clinic directors with live demonstration of tungsten carbide instruments.',
    booth: 'Hall 10 / Stand B42'
  },
  {
    id: 'expomed',
    name: 'Expomed Eurasia',
    location: 'Istanbul Expo Center, Turkey',
    date: 'March 24 – 26, 2026',
    category: 'Eurasian Health & Diagnostics',
    image: '/images/surgical-instruments-blue.jpg',
    description: 'Connecting with Central Asian and Eastern European hospital supply chains for surgical set tenders and customized hospital kits.',
    booth: 'Hall 3 / Stand 312'
  }
]

export function EventsSection() {
  return (
    <section className='py-20 bg-white border-b border-slate-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        
        {/* Section Header */}
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4'>
          <div>
            <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2'>
              <Calendar size={13} />
              <span>International Medical Expos</span>
            </div>
            <h2 className='text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight'>
              Exhibitions & Global Events
            </h2>
            <p className='text-slate-600 text-sm mt-1 max-w-xl'>
              Meet our leadership and technical engineering team at leading medical trade fairs worldwide.
            </p>
          </div>

          <Link
            href='/events'
            className='inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all self-start md:self-auto'
          >
            <span>View All Trade Fairs</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Events Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {EVENTS.map(event => (
            <div 
              key={event.id}
              className='bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/80 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group'
            >
              <div>
                {/* Event Image Banner */}
                {event.image && (
                  <div className='relative h-44 w-full overflow-hidden bg-slate-900'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={event.image} 
                      alt={`${event.name} Surgical Showcase`}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent' />
                    <div className='absolute top-3 right-3'>
                      <span className='text-slate-900 font-bold bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/40 text-[11px] shadow-sm'>
                        {event.booth}
                      </span>
                    </div>
                  </div>
                )}

                <div className='p-6 pb-2'>
                  {/* Event Category */}
                  <div className='flex items-center justify-between text-xs font-semibold mb-3'>
                    <span className='text-blue-600 uppercase tracking-wider text-[11px] font-extrabold'>{event.category}</span>
                  </div>

                  <h3 className='text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2'>
                    {event.name}
                  </h3>

                  <p className='text-xs text-slate-600 leading-relaxed mb-2'>
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Date & Location */}
              <div className='p-6 pt-3 border-t border-slate-200/80 space-y-2 text-xs text-slate-700'>
                <div className='flex items-center gap-2 font-semibold text-slate-900'>
                  <Calendar size={14} className='text-blue-600' />
                  <span>{event.date}</span>
                </div>
                <div className='flex items-center gap-2 text-slate-600'>
                  <MapPin size={14} className='text-rose-500 shrink-0' />
                  <span className='truncate'>{event.location}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
