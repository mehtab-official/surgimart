'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Calendar, 
  MapPin, 
  Building2, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Globe2, 
  Filter,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react'
import { BackButton } from '@/components/ui/BackButton'
import type { MedicalExpo } from '@/shared/data/events'

interface Props {
  initialEvents: MedicalExpo[]
}

export function EventsClient({ initialEvents }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<'upcoming' | 'all' | 'past'>('upcoming')
  const [selectedCountry, setSelectedCountry] = useState<string>('All')

  // Calculate live dynamic status according to current date
  const processedEvents = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return initialEvents.map(event => {
      const start = new Date(event.startDate)
      const end = new Date(event.endDate)
      end.setHours(23, 59, 59, 999)

      let status: 'live' | 'upcoming' | 'past' = 'upcoming'
      let daysRemaining: number | null = null

      if (today > end) {
        status = 'past'
      } else if (today >= start && today <= end) {
        status = 'live'
      } else {
        status = 'upcoming'
        const diffTime = start.getTime() - today.getTime()
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      }

      const formattedDateRange = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

      return {
        ...event,
        status,
        daysRemaining,
        formattedDateRange,
        startTime: start.getTime()
      }
    }).sort((a, b) => {
      if (a.status === 'past' && b.status !== 'past') return 1
      if (a.status !== 'past' && b.status === 'past') return -1
      return a.startTime - b.startTime
    })
  }, [initialEvents])

  // Get list of unique countries for filter
  const countries = useMemo(() => {
    const list = Array.from(new Set(initialEvents.map(e => e.location.country)))
    return ['All', ...list]
  }, [initialEvents])

  // Filter based on tab and country
  const filteredEvents = useMemo(() => {
    return processedEvents.filter(event => {
      if (filter === 'upcoming' && event.status === 'past') return false
      if (filter === 'past' && event.status !== 'past') return false
      if (selectedCountry !== 'All' && event.location.country !== selectedCountry) return false
      return true
    })
  }, [processedEvents, filter, selectedCountry])

  const upcomingCount = useMemo(() => processedEvents.filter(e => e.status !== 'past').length, [processedEvents])
  const pastCount = useMemo(() => processedEvents.filter(e => e.status === 'past').length, [processedEvents])

  function handleBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      
      {/* ── HERO BANNER WITH BACKGROUND IMAGE ── */}
      <section className='relative text-white py-16 sm:py-24 overflow-hidden bg-slate-950'>
        {/* Background Image & Adaptive Gradient Overlays - Darkened Text Zone */}
        <div className='absolute inset-0 z-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src='/images/image3.jpeg' 
            alt='SubMedOrtho Precision Surgical Instrument Expo Display' 
            className='w-full h-full object-cover object-right sm:object-center opacity-65 filter brightness-105 contrast-110'
          />
          {/* Left Scrim: Solid dark protection behind text side, fading into bright image on right */}
          <div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 via-45% to-slate-950/25' />
          <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50' />
          <div className='absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15' />
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 relative z-10'>
          
          {/* Top Back Navigation Button */}
          <div className='mb-6'>
            <BackButton label='← Back to Previous Page' variant='dark' fallbackUrl='/' />
          </div>

          <div className='max-w-3xl'>
            <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-400/30 backdrop-blur-md'>
              <Globe2 size={13} />
              <span>International Medical Trade Fairs & Expos</span>
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-6'>
              Global Healthcare <span className='bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent'>Exhibitions</span>
            </h1>
            <p className='text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl'>
              Explore premier international medical trade exhibitions across Germany, UAE, Turkey, and the Americas featuring surgical instrument innovations, ISO quality standards, and hospital procurement insights.
            </p>
            <div className='flex flex-wrap gap-3 text-xs font-semibold text-slate-300'>
              <span className='px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/10'>MEDICA Germany</span>
              <span className='px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/10'>WHX Dubai</span>
              <span className='px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/10'>FIME Miami</span>
              <span className='px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30'>Distal Femoral Trauma Kits Showcase</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUTOMATED EVENT TIMELINE & FILTERS ── */}
      <section className='py-8 border-b border-slate-200/80 bg-white sticky top-[110px] z-20 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4'>
          
          {/* Status Tabs */}
          <div className='flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200'>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'upcoming' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming Expos ({upcomingCount})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Events ({processedEvents.length})
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'past' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past Archive ({pastCount})
            </button>
          </div>

          {/* Country Selector */}
          <div className='flex items-center gap-2 text-xs font-semibold text-slate-600'>
            <Filter size={14} className='text-blue-600' />
            <span>Filter by Region:</span>
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className='bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer'
            >
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

        </div>
      </section>

      {/* ── EVENT LISTINGS ── */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          
          {filteredEvents.length > 0 ? (
            <div className='space-y-6'>
              {filteredEvents.map(event => {
                const isUpcoming = event.status === 'upcoming'
                const isLive = event.status === 'live'

                return (
                  <div
                    key={event.id}
                    className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden ${
                      isLive 
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                        : isUpcoming 
                          ? 'border-slate-200 hover:border-blue-500/60' 
                          : 'border-slate-200 opacity-75'
                    }`}
                  >
                    {/* Status Ribbon / Badge */}
                    <div className='flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100'>
                      <div className='flex items-center gap-2'>
                        {isLive && (
                          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 animate-pulse'>
                            <span className='w-2 h-2 rounded-full bg-emerald-600' />
                            EVENT LIVE NOW
                          </span>
                        )}
                        {isUpcoming && (
                          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100'>
                            <Clock size={12} className='text-blue-600' />
                            {event.daysRemaining === 1 ? 'Starts Tomorrow' : `In ${event.daysRemaining} Days`}
                          </span>
                        )}
                        {event.status === 'past' && (
                          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500'>
                            Concluded
                          </span>
                        )}
                        <span className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                          {event.category}
                        </span>
                      </div>

                      {/* Organizer & Location Badge */}
                      <div className='flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200'>
                        <span className='text-blue-600'>{event.location.city}, {event.location.country}</span>
                      </div>
                    </div>

                    {/* Main Event Content */}
                    <div className='pt-6 space-y-4'>
                      
                      {/* Event Visual Banner if present */}
                      {event.image && (
                        <div className='relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 mb-4 group'>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={event.image} 
                            alt={`${event.shortName} Surgical Instruments Display`}
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95'
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent' />
                          <div className='absolute bottom-3 left-4 right-4 flex items-center justify-between text-white'>
                            <span className='text-xs font-bold bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20'>
                              {event.booth} • {event.hall}
                            </span>
                            <span className='text-[11px] font-medium text-slate-300 hidden sm:inline'>
                              SubMedOrtho Sialkot Delegation
                            </span>
                          </div>
                        </div>
                      )}

                      <div className='space-y-1'>
                        <div className='text-xs font-semibold text-blue-600'>{event.organizer}</div>
                        <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
                          {event.title}
                        </h2>
                      </div>

                      {/* Date & Location Pills */}
                      <div className='flex flex-wrap gap-4 text-xs font-semibold text-slate-700'>
                        <div className='flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80'>
                          <Calendar size={14} className='text-blue-600 shrink-0' />
                          <span>{event.formattedDateRange}</span>
                        </div>
                        <div className='flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80'>
                          <MapPin size={14} className='text-rose-500 shrink-0' />
                          <span>{event.location.venue}, {event.location.city}, {event.location.country}</span>
                        </div>
                      </div>

                      <p className='text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl'>
                        {event.description}
                      </p>

                      {/* Focus Areas Chips, Official Link, and Back Button inside card */}
                      <div className='flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100'>
                        <div className='flex flex-wrap gap-1.5'>
                          {event.focusAreas.map(tag => (
                            <span key={tag} className='text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md'>
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className='flex items-center gap-2'>
                          <button
                            onClick={handleBack}
                            className='inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors'
                          >
                            <ArrowLeft size={13} />
                            <span>Back</span>
                          </button>

                          {event.externalUrl && (
                            <a
                              href={event.externalUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/60 hover:bg-blue-100/60 px-4 py-2 rounded-xl border border-blue-200/60 transition-colors'
                            >
                              <span>Official Expo Portal</span>
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                )
              })}
            </div>
          ) : (
            <div className='text-center py-20 bg-white rounded-3xl border border-slate-200'>
              <p className='text-slate-600 text-base font-semibold'>No exhibitions found matching the selected filter.</p>
              <button
                onClick={() => { setFilter('all'); setSelectedCountry('All') }}
                className='mt-3 text-blue-600 font-bold text-xs hover:underline'
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </section>

    </div>
  )
}
