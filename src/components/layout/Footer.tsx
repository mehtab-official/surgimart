import Link from 'next/link'
import { 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Send, 
  Download, 
  Globe2, 
  Clock, 
  CheckCircle2,
  Instagram 
} from 'lucide-react'

export function Footer() {
  return (
    <footer className='bg-slate-950 text-slate-300 border-t border-slate-800 text-xs'>
      
      {/* ── TOP PRE-FOOTER INQUIRY BANNER ── */}
      <div className='bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 py-10 border-b border-slate-800/80'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left'>
          <div>
            <span className='inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-blue-400/30'>
              Direct Sialkot Export Desk
            </span>
            <h3 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight'>
              Looking for Bulk Surgical Procurement or OEM Sets?
            </h3>
            <p className='text-xs sm:text-sm text-slate-300 mt-1 max-w-xl'>
              Connect directly with our manufacturing engineers in Sialkot, Pakistan for quotations, custom laser marking, and international distributor terms.
            </p>
          </div>

          <div className='flex flex-wrap items-center justify-center gap-3 shrink-0'>
            <Link
              href='/quote'
              className='bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-lg transition-all'
            >
              Request a Quote (RFQ)
            </Link>
            <a
              href='https://pk.linkedin.com/in/submed-ortho-47439a425'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold text-xs py-3 px-5 rounded-xl transition-all flex items-center gap-1.5 shadow-md'
            >
              <svg className='w-3.5 h-3.5 fill-current' viewBox='0 0 24 24'>
                <path d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z' />
              </svg>
              <span>LinkedIn Profile</span>
            </a>
            <a
              href='https://www.instagram.com/submedortho'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:opacity-90 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all flex items-center gap-1.5 shadow-md'
            >
              <Instagram size={14} />
              <span>Instagram</span>
            </a>
            <Link
              href='/catalogue'
              className='bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs py-3 px-5 rounded-xl transition-all flex items-center gap-1.5'
            >
              <Download size={13} />
              <span>Download PDF</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN SITEMAP & EXPORT COLUMNS ── */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10'>
          
          {/* Col 1: Brand & Bio */}
          <div className='lg:col-span-2 space-y-4'>
            <Link href='/' className='flex items-center gap-3 group'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src='/uploads/products/logo69.png' 
                alt='SubMedOrtho' 
                className='h-12 w-auto object-contain' 
              />
              <div>
                <span className='block text-lg font-bold text-white leading-none'>
                  SubMed<span className='text-blue-500'>Ortho</span>
                </span>
                <span className='block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5'>
                  Surgical & Orthopedic Export
                </span>
              </div>
            </Link>

            <p className='text-slate-400 text-xs leading-relaxed max-w-sm'>
              SubMedOrtho has over 15 years of experience in manufacturing and exporting precision surgical, orthopedic, and ENT instruments from Sialkot, Pakistan. Committed to ISO 9001:2015 & ISO 13485:2016 quality standards.
            </p>

            <div className='space-y-2 pt-2 text-slate-300'>
              <div className='flex items-center gap-2.5'>
                <Phone size={14} className='text-blue-400 shrink-0' />
                <a href='tel:+923406218274' className='hover:text-white font-medium'>+92 340-6218274</a>
              </div>
              <div className='flex items-center gap-2.5'>
                <Mail size={14} className='text-blue-400 shrink-0' />
                <a href='mailto:sales@submedortho.com' className='hover:text-white font-medium'>sales@submedortho.com</a>
              </div>
              <div className='flex items-center gap-2.5'>
                <div className='w-3.5 h-3.5 rounded-full bg-[#0A66C2] flex items-center justify-center text-white shrink-0'>
                  <svg className='w-2 h-2 fill-current' viewBox='0 0 24 24'>
                    <path d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z' />
                  </svg>
                </div>
                <a 
                  href='https://pk.linkedin.com/in/submed-ortho-47439a425' 
                  target='_blank' 
                  rel='noopener noreferrer' 
                  className='hover:text-white font-medium text-sky-400'
                >
                  LinkedIn: Submed Ortho
                </a>
              </div>
              <div className='flex items-center gap-2.5'>
                <Instagram size={14} className='text-rose-400 shrink-0' />
                <a 
                  href='https://www.instagram.com/submedortho' 
                  target='_blank' 
                  rel='noopener noreferrer' 
                  className='hover:text-white font-medium text-rose-400'
                >
                  Instagram: @submedortho
                </a>
              </div>
              <div className='flex items-start gap-2.5'>
                <MapPin size={14} className='text-rose-400 shrink-0 mt-0.5' />
                <span>Sialkot, Punjab, Pakistan (Global Surgical Export Hub)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className='space-y-3'>
            <h4 className='text-white font-bold text-sm tracking-tight uppercase text-[11px] text-blue-400'>
              Product Showcase
            </h4>
            <ul className='space-y-2 text-slate-400'>
              <li><Link href='/shop?cat=general-surgery' className='hover:text-white transition-colors'>General Surgery Forceps</Link></li>
              <li><Link href='/shop?cat=orthopaedic' className='hover:text-white transition-colors'>Orthopaedic Bone Rongeurs</Link></li>
              <li><Link href='/shop?cat=ent' className='hover:text-white transition-colors'>ENT Specialty Tools</Link></li>
              <li><Link href='/shop?cat=neuro-spinal' className='hover:text-white transition-colors'>Neuro & Spine Instruments</Link></li>
              <li><Link href='/shop?cat=implants' className='hover:text-white transition-colors'>Locking Plates & Screws</Link></li>
              <li><Link href='/catalogue' className='hover:text-white text-blue-400 font-semibold transition-colors'>Download 2026 Catalogue</Link></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className='space-y-3'>
            <h4 className='text-white font-bold text-sm tracking-tight uppercase text-[11px] text-blue-400'>
              Company & Heritage
            </h4>
            <ul className='space-y-2 text-slate-400'>
              <li><Link href='/about' className='hover:text-white transition-colors'>About SubMedOrtho</Link></li>
              <li><Link href='/about' className='hover:text-white transition-colors'>15 Years Experience</Link></li>
              <li><Link href='/career' className='hover:text-white transition-colors'>Career & Craftsmanship</Link></li>
              <li><Link href='/certificates' className='hover:text-white transition-colors'>ISO 13485:2016 Certification</Link></li>
              <li><Link href='/supply-chain' className='hover:text-white transition-colors'>Supply Chain & SCCI</Link></li>
              <li><Link href='/quote' className='hover:text-white transition-colors'>Request Wholesale Quote</Link></li>
            </ul>
          </div>

          {/* Col 4: Insights & Legal */}
          <div className='space-y-3'>
            <h4 className='text-white font-bold text-sm tracking-tight uppercase text-[11px] text-blue-400'>
              Insights & Support
            </h4>
            <ul className='space-y-2 text-slate-400'>
              <li><Link href='/catalogue' className='hover:text-white transition-colors'>Resources & PDF Specs</Link></li>
              <li><Link href='/events' className='hover:text-white transition-colors'>Exhibitions & Expos</Link></li>
              <li><Link href='/blog' className='hover:text-white transition-colors'>Surgical Blogs & News</Link></li>
              <li><Link href='/faq' className='hover:text-white transition-colors'>Frequently Asked Questions</Link></li>
              <li><Link href='/contact' className='hover:text-white transition-colors'>Contact Export Support</Link></li>
              <li><a href='https://www.submedortho.com' target='_blank' rel='noopener noreferrer' className='hover:text-white transition-colors'>Official: www.submedortho.com</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── COPYRIGHT BAR ── */}
      <div className='border-t border-slate-900 bg-slate-950/90 py-6 text-slate-500 text-[11px]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div>
            © {new Date().getFullYear()} SubMedOrtho (www.submedortho.com). All rights reserved. Sialkot, Pakistan.
          </div>
          <div className='flex items-center gap-4 text-slate-400'>
            <span>ISO 9001:2015</span>
            <span>•</span>
            <span>ISO 13485:2016</span>
            <span>•</span>
            <span>CE Marking Standards</span>
          </div>
        </div>
      </div>

    </footer>
  )
}
