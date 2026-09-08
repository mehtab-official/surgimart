import type { Metadata } from 'next'
import Link from 'next/link'
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  HelpCircle, 
  Send, 
  GraduationCap, 
  Hammer, 
  TrendingUp, 
  HeartHandshake,
  MapPin
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Career & Life at SubMedOrtho | Surgical Craftsmanship Team',
  description: 'Join SubMedOrtho in Sialkot, Pakistan. Learn about our culture, craftsmanship values, current openings, and hands-on manufacturing training.',
}

const FAQS = [
  {
    q: '1. How can I apply for a job at SubMedOrtho?',
    a: 'Send your CV and a short introduction directly to sales@submedortho.com. We will review your application and reach out if there is a suitable fit.'
  },
  {
    q: '2. Do you offer training for new workers?',
    a: 'Yes — we are happy to train motivated individuals, especially those with some background in metalwork, machining, or surgical instrument finishing.'
  },
  {
    q: '3. What is the work environment like?',
    a: 'We are a small, hands-on, collaborative team where you work closely with experienced craftsmen and have room to take on responsibilities as the company expands.'
  },
  {
    q: '4. What qualities do you look for in candidates?',
    a: 'Attention to detail, reliability, craftsmanship mindset, and a willingness to learn. Prior experience in surgical instrument manufacturing is a plus but not always required.'
  },
  {
    q: '5. What is the hiring process like?',
    a: 'Simple and direct — send your CV with a note on your experience, and if it aligns with our needs, we will invite you in for a direct conversation and practical review.'
  }
]

export default function CareerPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      
      {/* ── HERO BANNER WITH BACKGROUND IMAGE ── */}
      <section className='relative text-white py-16 sm:py-24 overflow-hidden bg-slate-950'>
        {/* Background Image & Adaptive Gradient Overlays */}
        <div className='absolute inset-0 z-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src='/images/image5.jpg' 
            alt='SubMedOrtho Precision Surgical Instrument Team' 
            className='w-full h-full object-cover object-center opacity-30 filter brightness-90'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/45' />
          <div className='absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15' />
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 relative z-10'>
          <div className='mb-6'>
            <Link 
              href='/'
              className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors'
            >
              ← Back to Home
            </Link>
          </div>

          <div className='max-w-3xl'>
            <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-400/30 backdrop-blur-md'>
              <Briefcase size={13} />
              <span>Life & Opportunities at SubMedOrtho</span>
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6'>
              Crafting Excellence in <span className='text-blue-400'>Surgical Manufacturing</span>
            </h1>
            <p className='text-lg sm:text-xl text-slate-300 font-medium leading-relaxed mb-8'>
              Be part of a dedicated team based in Sialkot, Pakistan, committed to precision metalwork, surgical craftsmanship, and continuous growth.
            </p>
            <div className='flex flex-wrap gap-3 text-xs font-semibold text-slate-200'>
              <span className='px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-sm'>Master Artisan Mentorship</span>
              <span className='px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-sm'>Hands-On Sialkot Metalwork</span>
              <span className='px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-sm'>Equal Opportunity Hub</span>
              <span className='px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 backdrop-blur-md border border-amber-500/30 font-bold'>Sialkot, Pakistan</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIFE AT SUBMEDORTHO & CULTURE ── */}
      <section className='py-16 bg-white border-b border-slate-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
            
            <div className='lg:col-span-7 space-y-6'>
              <span className='text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100'>
                Our Culture & Values
              </span>
              <h2 className='text-3xl font-extrabold text-slate-900 tracking-tight'>
                Life at SubMedOrtho
              </h2>
              <div className='space-y-4 text-slate-600 text-base leading-relaxed'>
                <p>
                  At <strong>SubMedOrtho</strong>, we&apos;re a growing team based in <strong>Sialkot, Pakistan</strong>, working to build a reliable name in surgical and orthopedic instrument manufacturing.
                </p>
                <p>
                  We value hard work, attention to detail, and a hands-on approach to craftsmanship. As we grow, we&apos;re building a workplace where every team member&apos;s contribution matters and where dedication to quality is rewarded.
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2'>
                <div className='p-5 rounded-2xl bg-slate-50 border border-slate-200/80'>
                  <Hammer size={22} className='text-blue-600 mb-2' />
                  <h3 className='font-bold text-slate-900 text-sm mb-1'>Craftsmanship</h3>
                  <p className='text-xs text-slate-600 leading-relaxed'>
                    We take pride in the precision and care that goes into every instrument we produce.
                  </p>
                </div>

                <div className='p-5 rounded-2xl bg-slate-50 border border-slate-200/80'>
                  <TrendingUp size={22} className='text-blue-600 mb-2' />
                  <h3 className='font-bold text-slate-900 text-sm mb-1'>Growth Mindset</h3>
                  <p className='text-xs text-slate-600 leading-relaxed'>
                    As a growing company, we value people who want to learn, improve, and grow with us.
                  </p>
                </div>

                <div className='p-5 rounded-2xl bg-slate-50 border border-slate-200/80'>
                  <HeartHandshake size={22} className='text-blue-600 mb-2' />
                  <h3 className='font-bold text-slate-900 text-sm mb-1'>Reliability</h3>
                  <p className='text-xs text-slate-600 leading-relaxed'>
                    We&apos;re committed to consistency in our work and in how we treat our team.
                  </p>
                </div>
              </div>
            </div>

            <div className='lg:col-span-5 space-y-6'>
              <div className='rounded-3xl overflow-hidden border border-slate-200 shadow-md relative group'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src='/images/custom-titanium-tools.jpg'
                  alt='SubMedOrtho Craftsmen Precision Titanium Surgical Instruments'
                  className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent' />
                <div className='absolute bottom-4 left-4 right-4 text-white'>
                  <span className='text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-900/60 px-2 py-0.5 rounded'>Master Apprenticeship</span>
                  <p className='text-xs font-semibold text-slate-200 mt-1'>
                    Learn hand-filing, box joint calibration, and titanium anodizing alongside senior Sialkot artisans.
                  </p>
                </div>
              </div>

              <div className='bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-6'>
                <h3 className='text-2xl font-bold tracking-tight'>Why Work With Us?</h3>
                <div className='space-y-4 text-xs sm:text-sm text-slate-200'>
                  <div className='flex items-start gap-3'>
                    <div className='w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0 mt-0.5'>
                      <GraduationCap size={14} />
                    </div>
                    <div>
                      <div className='font-bold text-white mb-0.5'>Hands-On Experience</div>
                      <div>Learn surgical instrument manufacturing directly from experienced craftsmen in Sialkot&apos;s surgical instrument hub.</div>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0 mt-0.5'>
                      <TrendingUp size={14} />
                    </div>
                    <div>
                      <div className='font-bold text-white mb-0.5'>Growing Company</div>
                      <div>Be part of a business in its early growth stages, with room to take on responsibility and leadership.</div>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0 mt-0.5'>
                      <HeartHandshake size={14} />
                    </div>
                    <div>
                      <div className='font-bold text-white mb-0.5'>Fair Treatment</div>
                      <div>We&apos;re committed to fair compensation and ethical workplace practices as we build out our operations.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CURRENT OPENINGS & DIRECT APPLICATION ── */}
      <section className='py-16 bg-slate-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          
          <div className='max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center'>
            <span className='text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100'>
              Join Our Workforce
            </span>
            <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-4'>
              Current Openings & Talent Connection
            </h2>
            <p className='text-slate-600 text-sm leading-relaxed mb-8 max-w-xl mx-auto'>
              We&apos;re a small but growing team. While we don&apos;t have a long list of open roles right now, we&apos;re always interested in connecting with skilled <strong>instrument makers, finishers, CNC operators, and packaging/QC staff</strong> in the Sialkot area.
            </p>

            <div className='bg-slate-50 rounded-2xl p-6 border border-slate-200/80 mb-8 text-left space-y-3'>
              <div className='flex items-center gap-2 text-sm font-bold text-slate-900'>
                <MapPin size={16} className='text-blue-600' />
                <span>Location: Sialkot Industrial Zone, Pakistan</span>
              </div>
              <p className='text-xs text-slate-600'>
                Interested in joining us? Send your CV and a short note about your experience directly to our hiring team:
              </p>
              <div className='pt-2'>
                <a
                  href='mailto:sales@submedortho.com?subject=Job Application - SubMedOrtho Career'
                  className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors shadow-sm'
                >
                  <Mail size={14} />
                  <span>Send Application to: sales@submedortho.com</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS (CAREER) ── */}
      <section className='py-16 bg-white border-t border-slate-100'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6'>
          
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-2'>
              <HelpCircle size={13} />
              <span>Career FAQ</span>
            </div>
            <h2 className='text-3xl font-extrabold text-slate-900 tracking-tight'>
              Frequently Asked Questions
            </h2>
          </div>

          <div className='space-y-4'>
            {FAQS.map((faq, idx) => (
              <div key={idx} className='p-6 rounded-2xl bg-slate-50 border border-slate-200/80'>
                <h3 className='font-bold text-slate-900 text-sm mb-2'>{faq.q}</h3>
                <p className='text-xs text-slate-600 leading-relaxed'>{faq.a}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  )
}
