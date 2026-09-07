import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Download, Eye, ArrowRight, ShieldCheck, CheckCircle2, Package, Sparkles, FolderArchive, ArrowDownToLine } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Official Product Catalogues & PDF Downloads | SubMedOrtho',
  description: 'Download the comprehensive SubMedOrtho surgical, orthopedic, ENT, implants, and general surgery export catalogues.',
}

const CATALOGUES = [
  {
    id: 'master-catalogue',
    title: 'SubMedOrtho Master Export Catalogue',
    category: 'Full Directory',
    description: 'Comprehensive export directory covering all surgical disciplines, titanium implants, bone rongeurs, and precision forceps manufactured in Sialkot.',
    pages: 'Master Catalog',
    size: '6.26 MB',
    fileUrl: '/catalogues/master-surgical-catalogue.pdf',
    fileName: 'SubMedOrtho-Master-Surgical-Catalogue.pdf',
    featured: true,
    badges: ['ISO 13485:2016 Compliant', 'Full Specifications', 'Master Edition']
  },
  {
    id: 'general-surgery',
    title: 'General Surgery Instruments Catalogue',
    category: 'General Surgery',
    description: 'Precision hemostatic Kelly/Crile forceps, Mayo dissecting scissors, tungsten carbide needle holders, and retractor systems.',
    pages: 'Complete Range',
    size: '13.9 MB',
    fileUrl: '/catalogues/general-surgery-catalogue.pdf',
    fileName: 'SubMedOrtho-General-Surgery-Catalogue.pdf',
    featured: false,
    badges: ['AISI 410/420 Steel', 'TC Gold Inserts', 'Autoclave Proof']
  },
  {
    id: 'orthopedic-systems',
    title: 'Orthopedic Trauma & Rongeurs Catalogue',
    category: 'Orthopaedics',
    description: 'Double action Stille-Luer bone rongeurs, bone cutting forceps, osteotomes, bone holding clamps, and orthopedic surgery sets.',
    pages: 'Trauma & Bone',
    size: '5.66 MB',
    fileUrl: '/catalogues/orthopedic-instruments-catalogue.pdf',
    fileName: 'SubMedOrtho-Orthopedic-Instruments-Catalogue.pdf',
    featured: false,
    badges: ['High Carbon Steel', 'Compound Double Action', 'Satin Finish']
  },
  {
    id: 'implants-plates',
    title: 'Implants & Locking Plating Systems Catalogue',
    category: 'Implants & Plates',
    description: 'Low-profile titanium distal radius plates, small fragment 2.7/3.5mm locking compression plates (LCP), combi-holes, and cortical screws.',
    pages: 'Trauma Fixation',
    size: '6.67 MB',
    fileUrl: '/catalogues/implants-trauma-catalogue.pdf',
    fileName: 'SubMedOrtho-Implants-Locking-Plates-Catalogue.pdf',
    featured: false,
    badges: ['Pure Medical Titanium', 'Variable Angle Screws', 'CE & ISO 13485']
  },
  {
    id: 'ent-specialty',
    title: 'ENT (Ear, Nose & Throat) Specialty Catalogue',
    category: 'ENT Specialty',
    description: 'Hartmann micro ear forceps, micro suction tubes, aural specula, nasal dressing forceps, and tonsillectomy instruments.',
    pages: 'Micro Precision',
    size: '13.2 MB',
    fileUrl: '/catalogues/ent-specialty-catalogue.pdf',
    fileName: 'SubMedOrtho-ENT-Specialty-Catalogue.pdf',
    featured: false,
    badges: ['German Stainless', 'Fine Microsurgical Jaws', 'Non-Reflective']
  }
]

export default function CataloguePage() {
  return (
    <div className='min-h-screen bg-slate-50 py-10 sm:py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        
        {/* Back Button */}
        <div className='mb-6'>
          <Link 
            href='/'
            className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-sm'
          >
            ← Back to Home
          </Link>
        </div>

        {/* Header section */}
        <div className='text-center max-w-3xl mx-auto mb-12'>
          <span className='inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 mb-4 border border-blue-200'>
            <FileText size={13} />
            Official Export Documentation
          </span>
          <h1 className='text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight'>
            SubMed<span className='text-blue-600'>Ortho</span> Product Catalogues
          </h1>
          <p className='mt-3 text-sm sm:text-base text-slate-600 leading-relaxed'>
            Download our authentic manufacturer catalogues with complete dimensional blueprints, German steel specifications (AISI 410/420 & Pure Titanium), and ISO 13485 compliance reference codes.
          </p>
        </div>

        {/* Featured Master Catalogue */}
        <div className='rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-12 relative overflow-hidden border border-slate-800 bg-slate-950'>
          {/* Background image & gradient overlay - Darkened Text Zone */}
          <div className='absolute inset-0 z-0'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src='/images/image3.jpeg' 
              alt='SubMedOrtho Precision Instrument Sets' 
              className='w-full h-full object-cover object-right sm:object-center opacity-70 filter brightness-105 contrast-110'
            />
            {/* Left Scrim: Solid dark protection behind text side, fading into bright image on right */}
            <div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 via-45% to-slate-950/25' />
            <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50' />
            <div className='absolute -right-16 -top-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none' />
          </div>
          
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10'>
            <div className='lg:col-span-8 space-y-4'>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30 backdrop-blur-sm'>
                <Sparkles size={13} />
                <span>Primary Master Export Edition</span>
              </div>
              <h2 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight'>
                {CATALOGUES[0].title}
              </h2>
              <p className='text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal'>
                {CATALOGUES[0].description}
              </p>
              
              <div className='flex flex-wrap gap-2 pt-2'>
                {CATALOGUES[0].badges.map(b => (
                  <span key={b} className='inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-xl bg-white/10 text-slate-200 border border-white/10 backdrop-blur-sm'>
                    <CheckCircle2 size={13} className='text-blue-400' />
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className='lg:col-span-4 flex flex-col gap-3 justify-center'>
              <div className='p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 mb-2'>
                <div className='flex items-center justify-between text-xs text-slate-300 mb-1'>
                  <span className='font-bold text-white'>Master Export Edition</span>
                  <span className='text-amber-400 font-mono font-bold'>{CATALOGUES[0].size}</span>
                </div>
                <p className='text-[11px] text-slate-400'>
                  Includes full technical blueprints, ISO 13485 compliance & German steel specs.
                </p>
              </div>

              <a
                href={CATALOGUES[0].fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-xs uppercase tracking-wider'
              >
                <Eye size={15} />
                <span>View Online PDF Preview</span>
              </a>
              <a
                href={CATALOGUES[0].fileUrl}
                download={CATALOGUES[0].fileName}
                className='flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-6 rounded-xl border border-white/20 transition-all text-xs uppercase tracking-wider'
              >
                <ArrowDownToLine size={15} />
                <span>Download PDF ({CATALOGUES[0].size})</span>
              </a>
            </div>
          </div>
        </div>

        {/* Discipline & Specialty Specific Catalogues Grid */}
        <div className='mb-6'>
          <h3 className='text-xl sm:text-2xl font-bold text-slate-900 tracking-tight'>
            Discipline-Specific PDF Catalogues
          </h3>
          <p className='text-xs text-slate-500 mt-1'>
            Select your medical specialty for targeted instrument codes, pattern specifications, and wholesale sets.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
          {CATALOGUES.slice(1).map(cat => (
            <div 
              key={cat.id} 
              className='bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group'
            >
              <div>
                <div className='flex items-center justify-between text-xs text-slate-500 font-semibold mb-3'>
                  <span className='text-blue-600 font-bold uppercase tracking-wider text-[11px]'>{cat.category}</span>
                  <span className='bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-bold'>{cat.size}</span>
                </div>

                <h4 className='font-bold text-slate-900 text-base mb-2 group-hover:text-blue-600 transition-colors leading-snug'>
                  {cat.title}
                </h4>

                <p className='text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3'>
                  {cat.description}
                </p>

                <div className='flex flex-wrap gap-1.5 mb-6'>
                  {cat.badges.map(b => (
                    <span key={b} className='text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-600 font-medium'>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className='flex items-center gap-2 pt-4 border-t border-slate-100'>
                <a
                  href={cat.fileUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors'
                >
                  <Eye size={13} />
                  <span>Preview</span>
                </a>
                <a
                  href={cat.fileUrl}
                  download={cat.fileName}
                  className='flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors'
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Custom inquiry CTA */}
        <div className='bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 text-center max-w-3xl mx-auto shadow-sm space-y-4'>
          <h4 className='text-xl font-bold text-slate-900'>Need Custom Set Blueprints or OEM Laser Etching?</h4>
          <p className='text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto'>
            We manufacture bespoke hospital kits, specialized dimensional patterns, and private-label packaging direct from our Sialkot manufacturing plant.
          </p>
          <div className='pt-2'>
            <Link
              href='/quote'
              className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-7 py-3.5 rounded-xl transition-all shadow-md'
            >
              <span>Request Custom OEM / Export Quotation</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
