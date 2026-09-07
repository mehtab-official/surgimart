import type { Metadata } from 'next'
import Link from 'next/link'
import { Award, ShieldCheck, CheckCircle2, FileCheck, Building2, Download, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Global Recognition & ISO Certifications | SubMedOrtho',
  description: 'SubMedOrtho aligns its manufacturing with ISO 9001:2015 and ISO 13485:2016 international standards for quality management in surgical medical devices.',
}

export default function CertificatesPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      
      {/* ── HERO BANNER ── */}
      <section className='bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-16 sm:py-20 relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15' />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 relative z-10'>
          <div className='mb-6'>
            <Link 
              href='/'
              className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors'
            >
              ← Back to Home
            </Link>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-center'>
            <div className='lg:col-span-7'>
              <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-400/30'>
                <Award size={13} />
                <span>International Standards & Quality</span>
              </div>
              <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6'>
                Global Recognition & <span className='text-blue-400'>Certifications</span>
              </h1>
              <p className='text-lg sm:text-xl text-slate-300 font-medium leading-relaxed mb-6'>
                Ensuring surgical precision, international compliance, and reliable quality management systems across every manufactured device.
              </p>
              <div className='flex flex-wrap gap-3 text-xs font-semibold text-slate-300'>
                <span className='px-3 py-1.5 rounded-xl bg-white/5 border border-white/10'>ISO 13485:2016 Certified</span>
                <span className='px-3 py-1.5 rounded-xl bg-white/5 border border-white/10'>ISO 9001:2015 Framework</span>
                <span className='px-3 py-1.5 rounded-xl bg-white/5 border border-white/10'>CE Medical Device Compliance</span>
              </div>
            </div>

            {/* Document Authentic Certification Badges (image7.png) */}
            <div className='lg:col-span-5'>
              <div className='relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl group bg-white p-6'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src='/images/image7.png' 
                  alt='SubMedOrtho ISO 13485, ISO 9001, CE Certified' 
                  className='w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500'
                />
                <div className='mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-bold'>
                  <span>Internationally Audited</span>
                  <span className='text-blue-600'>Export Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATE DETAIL & FRAMEWORKS ── */}
      <section className='py-16 bg-white border-b border-slate-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
            
            <div className='lg:col-span-7 space-y-6'>
              <span className='text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100'>
                Certified & Professional
              </span>
              <h2 className='text-3xl font-extrabold text-slate-900 tracking-tight'>
                Commitment to International Standards
              </h2>
              <div className='space-y-4 text-slate-600 text-base leading-relaxed'>
                <p>
                  At <strong>SubMedOrtho</strong>, our goal is to provide surgical instruments that healthcare professionals and international distributors can rely on with complete confidence.
                </p>
                <p>
                  We are committed to maintaining high standards across our production process, aligning our operations with internationally recognized quality frameworks:
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2'>
                <div className='p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2'>
                  <div className='flex items-center gap-2 text-blue-600 font-bold text-base'>
                    <ShieldCheck size={20} />
                    <span>ISO 9001:2015</span>
                  </div>
                  <p className='text-xs text-slate-600 leading-relaxed'>
                    Quality Management Systems ensuring consistent production excellence and customer satisfaction.
                  </p>
                </div>

                <div className='p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2'>
                  <div className='flex items-center gap-2 text-blue-600 font-bold text-base'>
                    <Award size={20} />
                    <span>ISO 13485:2016</span>
                  </div>
                  <p className='text-xs text-slate-600 leading-relaxed'>
                    Medical Device Manufacturing Quality Standard covering regulatory compliance, risk management, and traceability.
                  </p>
                </div>
              </div>

              <div className='p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700 flex items-start gap-2.5'>
                <Building2 size={16} className='text-blue-600 mt-0.5 shrink-0' />
                <div>
                  <strong>SCCI & FBA Industry Affiliations:</strong> Active members of Sialkot Chamber of Commerce & Industry, staying updated with global trade guidelines.
                </div>
              </div>
            </div>

            {/* Certificate Preview Badge */}
            <div className='lg:col-span-5'>
              <div className='bg-slate-900 rounded-3xl p-8 text-white shadow-2xl text-center space-y-6 relative overflow-hidden'>
                <div className='w-20 h-20 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400'>
                  <FileCheck size={36} />
                </div>
                <div>
                  <h3 className='text-xl font-bold'>Quality Compliance Dossier</h3>
                  <p className='text-xs text-slate-400 mt-1'>
                    Complete material test reports & ISO compliance sheets
                  </p>
                </div>
                <div className='text-xs text-slate-300 text-left space-y-2.5 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60'>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 size={14} className='text-emerald-400' />
                    <span>Batch Traceability & Heat Treatment Logs</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 size={14} className='text-emerald-400' />
                    <span>Boil & Corrosion Resistance Testing</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 size={14} className='text-emerald-400' />
                    <span>Hardness Rockwell (HRC) Standard Verification</span>
                  </div>
                </div>

                <Link
                  href='/quote'
                  className='inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg'
                >
                  <span>Request Compliance Dossier</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
