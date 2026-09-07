import type { Metadata } from 'next'
import Link from 'next/link'
import { 
  ShieldCheck, 
  Award, 
  Clock, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Factory, 
  Globe2, 
  ArrowRight, 
  Leaf, 
  Users2, 
  Target,
  FileText
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us — 15 Years of Experience | SubMedOrtho',
  description: 'SubMedOrtho specializes in surgical and orthopedic instrument manufacturing in Sialkot, Pakistan. 15+ years of craftsmanship, ISO standards, and reliable global export.',
}

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      
      {/* ── HERO BANNER WITH BACKGROUND IMAGE ── */}
      <section className='relative text-white py-16 sm:py-24 overflow-hidden bg-slate-950'>
        {/* Background Image & Adaptive Gradient Overlays */}
        <div className='absolute inset-0 z-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src='/images/image5.jpg' 
            alt='SubMedOrtho Traditional Sialkot Surgical Craftsmanship' 
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
              <Building2 size={13} />
              <span>Company Profile & Heritage</span>
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6'>
              About <span className='text-blue-400'>SubMedOrtho</span>
            </h1>
            <p className='text-lg sm:text-xl text-slate-300 font-medium leading-relaxed mb-8'>
              15 Years of Experience in Precision Surgical & Orthopedic Instrument Manufacturing from Sialkot, Pakistan.
            </p>
            <div className='flex flex-wrap gap-3 text-xs font-semibold text-slate-200'>
              <span className='px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-sm'>Founded in Sialkot, 2010</span>
              <span className='px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-sm'>ISO 9001 & 13485 Standards</span>
              <span className='px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-sm'>SCCI & FBA Members</span>
              <span className='px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 backdrop-blur-md border border-amber-500/30 font-bold'>German Grade Steel</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 15 YEARS OF EXPERIENCE ── */}
      <section className='py-16 bg-white border-b border-slate-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
            
            <div className='lg:col-span-7 space-y-6'>
              <div className='inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider'>
                <Clock size={14} />
                <span>Established Heritage</span>
              </div>
              <h2 className='text-3xl font-extrabold text-slate-900 tracking-tight'>
                15 Years of Precision Manufacturing Experience
              </h2>
              <div className='space-y-4 text-slate-600 text-base leading-relaxed'>
                <p>
                  At <strong>SubMedOrtho</strong>, we pride ourselves on delivering personalized service and consistent quality. With over 15 years of experience, we&apos;ve built a strong presence in the medical instruments industry, specializing in surgical and orthopedic instruments manufactured in <strong>Sialkot, Pakistan</strong> — a globally renowned hub for surgical instrument production.
                </p>
                <p>
                  We&apos;re dedicated to precision, reliability, and steady growth. Our commitment to quality goes beyond the products themselves. We work closely with our clients to meet their specific requirements, and we&apos;re building toward becoming a dependable, long-term partner for distributors, clinics, hospital procurement teams, and buyers worldwide.
                </p>
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4'>
                <div className='p-4 rounded-xl bg-slate-50 border border-slate-200/80'>
                  <div className='text-2xl font-extrabold text-blue-600'>15+</div>
                  <div className='text-xs font-semibold text-slate-700 mt-1'>Years of Experience</div>
                </div>
                <div className='p-4 rounded-xl bg-slate-50 border border-slate-200/80'>
                  <div className='text-2xl font-extrabold text-blue-600'>1,500+</div>
                  <div className='text-xs font-semibold text-slate-700 mt-1'>Instrument Specs</div>
                </div>
                <div className='p-4 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1'>
                  <div className='text-2xl font-extrabold text-blue-600'>Sialkot</div>
                  <div className='text-xs font-semibold text-slate-700 mt-1'>Global Export Hub</div>
                </div>
              </div>
            </div>

            <div className='lg:col-span-5'>
              <div className='relative rounded-3xl bg-slate-900 p-8 text-white shadow-2xl overflow-hidden'>
                <div className='absolute inset-0 z-0 opacity-25'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src='/images/custom-surgical-kit.jpg'
                    alt='SubMedOrtho Precision Surgical Tool Manufacturing Sialkot'
                    className='w-full h-full object-cover filter brightness-90'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40' />
                </div>
                <div className='relative z-10'>
                  <div className='absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl' />
                  <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
                    <Factory size={20} className='text-blue-400' />
                    <span>Manufacturing Center</span>
                  </h3>
                  <p className='text-slate-300 text-sm leading-relaxed mb-6'>
                    Located in the heart of Sialkot&apos;s industrial sector, combining age-old metalworking craftsmanship with modern computer-assisted tooling and rigorous quality control inspection.
                  </p>
                  <div className='space-y-3 text-xs text-slate-200'>
                    <div className='flex items-center gap-2'>
                      <CheckCircle2 size={15} className='text-emerald-400 shrink-0' />
                      <span>Grade AISI 410 / 420 Stainless Steel</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <CheckCircle2 size={15} className='text-emerald-400 shrink-0' />
                      <span>Titanium & Tungsten Carbide Options</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <CheckCircle2 size={15} className='text-emerald-400 shrink-0' />
                      <span>Individual Autoclave & Hardness Testing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HISTORY OF INNOVATION TIMELINE ── */}
      <section className='py-16 bg-slate-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          
          <div className='text-center max-w-2xl mx-auto mb-16'>
            <span className='text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100'>
              Evolution & Milestones
            </span>
            <h2 className='text-3xl font-extrabold text-slate-900 mt-3 tracking-tight'>
              History of Innovation
            </h2>
            <p className='text-sm text-slate-600 mt-2'>
              Our journey from a dedicated local workshop to an international medical supplier.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            
            {/* 2010 */}
            <div className='bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow'>
              <div className='text-2xl font-black text-blue-600 mb-2'>2010</div>
              <h3 className='font-bold text-slate-900 text-base mb-2'>Founding & Early Steps</h3>
              <p className='text-xs text-slate-600 leading-relaxed'>
                SubMedOrtho was founded in Sialkot with a focus on manufacturing quality surgical and orthopedic instruments. Starting as a small operation, we concentrated on mastering core production processes and building relationships with our first clients.
              </p>
            </div>

            {/* 2015 */}
            <div className='bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow'>
              <div className='text-2xl font-black text-blue-600 mb-2'>2015</div>
              <h3 className='font-bold text-slate-900 text-base mb-2'>Building Our Client Base</h3>
              <p className='text-xs text-slate-600 leading-relaxed'>
                As word spread about our consistency and craftsmanship, we expanded our product range and began working with a wider base of buyers, strengthening our reputation for reliability.
              </p>
            </div>

            {/* 2020 */}
            <div className='bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow'>
              <div className='text-2xl font-black text-blue-600 mb-2'>2020</div>
              <h3 className='font-bold text-slate-900 text-base mb-2'>Strengthening Standards & Reach</h3>
              <p className='text-xs text-slate-600 leading-relaxed'>
                We invested in improving our quality control processes and began exploring export markets more seriously, laying the groundwork for a stronger international presence.
              </p>
            </div>

            {/* 2025 */}
            <div className='bg-white rounded-2xl p-6 border border-blue-200 shadow-sm relative bg-gradient-to-b from-white to-blue-50/40 hover:shadow-md transition-shadow'>
              <div className='text-2xl font-black text-blue-600 mb-2'>2025 — Present</div>
              <h3 className='font-bold text-slate-900 text-base mb-2'>Present Day Expansion</h3>
              <p className='text-xs text-slate-600 leading-relaxed'>
                Today, SubMedOrtho continues to grow steadily, expanding into online marketplaces like eBay to reach a broader global customer base while staying true to the quality standards that got us here.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── CERTIFIED & PROFESSIONAL ── */}
      <section className='py-16 bg-white border-y border-slate-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='max-w-3xl mb-12'>
            <span className='text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100'>
              Quality Frameworks
            </span>
            <h2 className='text-3xl font-extrabold text-slate-900 mt-3 tracking-tight'>
              We Are Certified and Professional
            </h2>
            <p className='text-slate-600 text-sm mt-3 leading-relaxed'>
              At SubMedOrtho, our goal is to provide surgical instruments that healthcare professionals and distributors can rely on. We are committed to maintaining high standards across our production process, and we align our operations with internationally recognized quality frameworks, including <strong>ISO 9001:2015</strong> and <strong>ISO 13485:2016</strong> standards for quality management in medical device manufacturing.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2'>
              <ShieldCheck className='text-blue-600' size={24} />
              <h3 className='font-bold text-slate-900 text-sm'>Comprehensive Quality Assurance</h3>
              <p className='text-xs text-slate-600 leading-relaxed'>
                Our processes are designed to consistently meet quality and safety expectations at every step of production.
              </p>
            </div>

            <div className='p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2'>
              <Award className='text-blue-600' size={24} />
              <h3 className='font-bold text-slate-900 text-sm'>Thorough Evaluation & Inspection</h3>
              <p className='text-xs text-slate-600 leading-relaxed'>
                Instruments go through careful checks, alignment calibration, and surface inspection before they reach our customers.
              </p>
            </div>

            <div className='p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2'>
              <Target className='text-blue-600' size={24} />
              <h3 className='font-bold text-slate-900 text-sm'>Commitment to Excellence</h3>
              <p className='text-xs text-slate-600 leading-relaxed'>
                We&apos;re continually working to improve our processes, metallurgical selection, and product quality.
              </p>
            </div>

            <div className='p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2'>
              <CheckCircle2 className='text-blue-600' size={24} />
              <h3 className='font-bold text-slate-900 text-sm'>Reliable and Trusted</h3>
              <p className='text-xs text-slate-600 leading-relaxed'>
                We aim for every product to meet the exact standards and dimensional tolerances our customers expect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUSTAINABILITY & COMMUNITY + FUTURE EXPANSION ── */}
      <section className='py-16 bg-slate-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            
            {/* Sustainability & Community */}
            <div className='bg-white rounded-3xl p-8 border border-slate-200 shadow-sm'>
              <div className='flex items-center gap-2.5 text-blue-600 font-bold text-xs uppercase tracking-wider mb-3'>
                <Leaf size={16} />
                <span>Social & Industrial Responsibility</span>
              </div>
              <h3 className='text-2xl font-extrabold text-slate-900 mb-4 tracking-tight'>
                Sustainability & Community
              </h3>
              <p className='text-xs text-slate-600 leading-relaxed mb-6'>
                At SubMedOrtho, we believe in doing business responsibly, even as a growing company.
              </p>

              <div className='space-y-4'>
                <div className='p-4 rounded-xl bg-slate-50 border border-slate-100'>
                  <div className='font-bold text-slate-900 text-sm mb-1'>Industry Membership</div>
                  <div className='text-xs text-slate-600 leading-relaxed'>
                    We are proud members of <strong>SCCI</strong> (Sialkot Chamber of Commerce & Industry) and local trade federations, staying closely connected with international industry standards and responsible practices.
                  </div>
                </div>

                <div className='p-4 rounded-xl bg-slate-50 border border-slate-100'>
                  <div className='font-bold text-slate-900 text-sm mb-1'>Responsible Operations</div>
                  <div className='text-xs text-slate-600 leading-relaxed'>
                    We aim to minimize waste in our production process, optimize material utilization, and handle scrap metal responsibly through certified recycling channels.
                  </div>
                </div>

                <div className='p-4 rounded-xl bg-slate-50 border border-slate-100'>
                  <div className='font-bold text-slate-900 text-sm mb-1'>Fair Workplace Practices</div>
                  <div className='text-xs text-slate-600 leading-relaxed'>
                    We&apos;re committed to treating our workforce fairly as we grow, maintaining ethical working conditions, fair wages, and a supportive environment for our craftsmen.
                  </div>
                </div>
              </div>
            </div>

            {/* Future Expansion & Plans */}
            <div className='bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between'>
              <div>
                <div className='flex items-center gap-2.5 text-blue-600 font-bold text-xs uppercase tracking-wider mb-3'>
                  <Globe2 size={16} />
                  <span>Strategic Vision</span>
                </div>
                <h3 className='text-2xl font-extrabold text-slate-900 mb-4 tracking-tight'>
                  Future Expansion & Plans
                </h3>
                <p className='text-xs text-slate-600 leading-relaxed mb-6'>
                  Strategic roadmap for expanding production capacity and international partner relations.
                </p>

                {/* Visual Image Banner */}
                <div className='rounded-2xl overflow-hidden mb-6 h-40 border border-slate-200/80 relative group'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src='/images/surgical-instruments-blue.jpg'
                    alt='SubMedOrtho Advanced Precision Surgical Sets'
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent' />
                  <div className='absolute bottom-2.5 left-3 right-3 text-[11px] font-bold text-white flex justify-between items-center'>
                    <span>Global Hospital Procurement Specs</span>
                    <span className='text-blue-300 text-[10px] uppercase tracking-wider bg-blue-950/80 px-2 py-0.5 rounded'>AISI 420 Steel</span>
                  </div>
                </div>

                <div className='space-y-3 text-xs text-slate-700'>
                  <div className='flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100/60'>
                    <CheckCircle2 size={16} className='text-blue-600 mt-0.5 shrink-0' />
                    <div>
                      <span className='font-bold text-slate-900'>Growing Our Online Presence:</span> Expanding our reach through eBay and dedicated B2B e-commerce platforms to connect with more buyers globally.
                    </div>
                  </div>

                  <div className='flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100/60'>
                    <CheckCircle2 size={16} className='text-blue-600 mt-0.5 shrink-0' />
                    <div>
                      <span className='font-bold text-slate-900'>Broadening Product Range:</span> Adding more specialized instrument sets across cardiovascular, microsurgery, and arthroscopy specialties.
                    </div>
                  </div>

                  <div className='flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100/60'>
                    <CheckCircle2 size={16} className='text-blue-600 mt-0.5 shrink-0' />
                    <div>
                      <span className='font-bold text-slate-900'>Tightening Quality Inspection:</span> Continuing to invest in advanced ultrasonic testing, dimensional verification gauges, and computerized QC logging.
                    </div>
                  </div>

                  <div className='flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100/60'>
                    <CheckCircle2 size={16} className='text-blue-600 mt-0.5 shrink-0' />
                    <div>
                      <span className='font-bold text-slate-900'>Building Long-Term Partnerships:</span> Focused on becoming a dependable, contracted supplier for international distributors and hospital groups.
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className='py-16 bg-slate-900 text-white text-center'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 space-y-6'>
          <h2 className='text-2xl sm:text-3xl font-extrabold tracking-tight'>
            Partner with a Dependable Surgical Instrument Manufacturer
          </h2>
          <p className='text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed'>
            Whether you need wholesale pricing, customized OEM instrument sets, or product catalogs, our team in Sialkot is ready to assist you.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-4 pt-2'>
            <Link
              href='/quote'
              className='bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3.5 px-7 rounded-xl shadow-lg transition-all'
            >
              Request a Quotation (RFQ)
            </Link>
            <Link
              href='/catalogue'
              className='bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold py-3.5 px-7 rounded-xl transition-all flex items-center gap-2'
            >
              <FileText size={14} />
              <span>Download Catalog PDF</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
