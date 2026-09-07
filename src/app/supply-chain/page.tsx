import type { Metadata } from 'next'
import Link from 'next/link'
import { 
  Truck, 
  ShieldCheck, 
  Factory, 
  Globe2, 
  CheckCircle2, 
  FileText, 
  Send, 
  Sparkles, 
  Cpu, 
  Waves, 
  Hammer, 
  Package, 
  Plane, 
  Ship, 
  Award, 
  Building2 
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Global Supply Chain & Manufacturing Process | SubMedOrtho',
  description: 'Learn about SubMedOrtho’s end-to-end supply chain — from metallurgical raw material sourcing in Sialkot to precision CNC forging, ASTM passivation, and worldwide air/sea export logistics.',
  keywords: [
    'surgical instrument supply chain',
    'medical device export logistics',
    'Sialkot manufacturing process',
    'ISO 13485 supply chain',
    'OEM surgical set packaging',
    'worldwide medical logistics'
  ]
}

const SUPPLY_CHAIN_STAGES = [
  {
    step: '01',
    title: 'Metallurgical Sourcing & Raw Material Testing',
    icon: ShieldCheck,
    subtitle: 'Traceability & Alloy Verification',
    description: 'We source high-grade surgical stainless steel (AISI 410, AISI 420, AISI 316L VM) and medical-grade Titanium (Grade 4 & 5). Every billet is certified with full mill test certificates (MTC) and undergoes spectroscopic alloy composition verification.',
    highlights: ['Mill Test Certificate (MTC) verification', 'Spectrometric alloy analysis', 'Full batch number traceability']
  },
  {
    step: '02',
    title: 'Drop Forging & CNC Precision Milling',
    icon: Factory,
    subtitle: 'Structural Density & Form Integrity',
    description: 'Hot drop-forging aligns the grain structure of the steel for maximum mechanical strength. Computerized 5-axis CNC milling machines sculpt blanks according to international surgical dimensional blueprints (DIN & ASTM).',
    highlights: ['Uniform grain flow alignment', '5-Axis CNC tolerance (+/- 0.02mm)', 'Precision blank shaping']
  },
  {
    step: '03',
    title: 'Heat Treatment & Rockwell Hardness Calibration',
    icon: Hammer,
    subtitle: 'Controlled Quenching & Tempering',
    description: 'Instruments undergo controlled atmospheric vacuum heat treatment followed by precision tempering to achieve the exact Rockwell hardness rating (50–55 HRC for cutting edges, 42–46 HRC for clamping shafts).',
    highlights: ['Vacuum atmospheric furnaces', 'Rockwell C Scale (HRC) calibration', 'Zero micro-brittleness']
  },
  {
    step: '04',
    title: 'Artisan Hand-Fitting & Tungsten Carbide Insertion',
    icon: Cpu,
    subtitle: 'Master Craftsman Articulation',
    description: 'Experienced Sialkot artisans hand-fit box joints, file delicate jaw serrations, and gold-braze tungsten carbide (TC) inserts onto needle holders and scissors to guarantee smooth, non-slip surgical feedback.',
    highlights: ['Master artisan hand-assembly', 'Silver-copper gold brazed TC jaws', 'Individually calibrated ratchet tension']
  },
  {
    step: '05',
    title: 'Ultrasonic Cleaning & ASTM A967 Passivation',
    icon: Waves,
    subtitle: 'Corrosion Shielding & Bio-Cleanliness',
    description: 'Multi-stage 40 kHz ultrasonic cavitation baths remove microscopic polishing compounds. Chemical nitric acid passivation removes free iron from the surface, forming a thick chromium oxide protective shield.',
    highlights: ['40 kHz ultrasonic cavitation', 'ASTM A967 nitric acid passivation', 'Boil & copper sulfate corrosion tests']
  },
  {
    step: '06',
    title: 'Custom OEM Laser Marking & Cleanroom Packaging',
    icon: Package,
    subtitle: 'Branding, Barcoding & UDI Readiness',
    description: 'Instruments receive high-contrast fiber laser etching (company logo, SKU, CE mark, batch lot, and UDI matrix). Products are packed in sterile-ready poly pouches, blister trays, or custom-molded silicone instrument cassettes.',
    highlights: ['High-resolution fiber laser marking', 'Unique Device Identification (UDI)', 'Custom private label boxes & cassettes']
  },
  {
    step: '07',
    title: 'Global Export Logistics & Customs Clearance',
    icon: Globe2,
    subtitle: 'Worldwide Air & Sea Freight',
    description: 'Partnering with DHL Express, FedEx, and international freight forwarders from Sialkot International Airport (SKT) and seaport dry ports, ensuring customs documentation, COO (Certificate of Origin), and insured door-to-door delivery.',
    highlights: ['Direct flights from Sialkot Cargo Hub', 'Full export COO & customs clearance', 'Real-time air waybill (AWB) tracking']
  }
]

export default function SupplyChainPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      
      {/* ── HERO BANNER WITH BACKGROUND IMAGE ── */}
      <section className='relative text-white py-16 sm:py-24 overflow-hidden bg-slate-950'>
        {/* Background Image & Adaptive Gradient Overlays */}
        <div className='absolute inset-0 z-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src='/images/surgical-instruments-blue.jpg' 
            alt='SubMedOrtho Precision Surgical Instruments & Global Supply Chain' 
            className='w-full h-full object-cover object-center opacity-45 filter brightness-105 contrast-110'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 via-45% to-slate-950/40' />
          <div className='absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20' />
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
              <Truck size={13} />
              <span>End-to-End Export Logistics & Manufacturing</span>
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6'>
              Our Global <span className='text-blue-400'>Supply Chain</span>
            </h1>
            <p className='text-lg sm:text-xl text-slate-300 font-medium leading-relaxed mb-8'>
              From metallurgical alloy certification in Sialkot, Pakistan to certified clean packaging and expedited international customs delivery worldwide.
            </p>
            <div className='flex flex-wrap gap-4'>
              <Link
                href='/quote'
                className='inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all'
              >
                Inquire Supply Capabilities
              </Link>
              <Link
                href='/certificates'
                className='inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 transition-all backdrop-blur-md'
              >
                View Compliance & ISO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUPPLY CHAIN PILLARS ── */}
      <section className='py-12 bg-white border-b border-slate-200/80'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left'>
            <div className='p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2'>
              <div className='text-2xl font-extrabold text-blue-600'>100%</div>
              <div className='text-sm font-bold text-slate-900'>Batch Traceability</div>
              <div className='text-xs text-slate-600'>Raw material mill certificates and lot number tracking on every order.</div>
            </div>

            <div className='p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2'>
              <div className='text-2xl font-extrabold text-blue-600'>60+</div>
              <div className='text-sm font-bold text-slate-900'>Export Destinations</div>
              <div className='text-xs text-slate-600'>Direct delivery across Europe, North America, Middle East, and Asia.</div>
            </div>

            <div className='p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2'>
              <div className='text-2xl font-extrabold text-blue-600'>ISO 13485</div>
              <div className='text-sm font-bold text-slate-900'>Certified Quality System</div>
              <div className='text-xs text-slate-600'>Comprehensive risk management and medical device regulatory alignment.</div>
            </div>

            <div className='p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2'>
              <div className='text-2xl font-extrabold text-blue-600'>Sialkot Hub</div>
              <div className='text-sm font-bold text-slate-900'>Dedicated Cargo Port</div>
              <div className='text-xs text-slate-600'>Direct air cargo connections from Sialkot International Airport (SKT).</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7-STAGE MANUFACTURING & SUPPLY TIMELINE ── */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          
          <div className='text-center max-w-3xl mx-auto mb-16 space-y-3'>
            <span className='text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100'>
              Manufacturing Journey
            </span>
            <h2 className='text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight'>
              From Raw Ingot to Operating Room
            </h2>
            <p className='text-slate-600 text-sm max-w-xl mx-auto leading-relaxed'>
              A transparent, step-by-step overview of how your surgical instruments are forged, calibrated, verified, and delivered.
            </p>
          </div>

          <div className='space-y-8'>
            {SUPPLY_CHAIN_STAGES.map((stage, idx) => {
              const Icon = stage.icon
              return (
                <div 
                  key={stage.step}
                  className='bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300'
                >
                  <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
                    
                    {/* Step Number & Icon */}
                    <div className='lg:col-span-3 flex items-center lg:flex-col lg:items-start gap-4'>
                      <div className='flex items-center gap-3'>
                        <span className='text-3xl font-black text-blue-600'>
                          {stage.step}
                        </span>
                        <div className='w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600'>
                          <Icon size={22} />
                        </div>
                      </div>
                      <div className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                        {stage.subtitle}
                      </div>
                    </div>

                    {/* Stage Details */}
                    <div className='lg:col-span-6 space-y-3'>
                      <h3 className='text-xl font-bold text-slate-900'>
                        {stage.title}
                      </h3>
                      <p className='text-xs sm:text-sm text-slate-600 leading-relaxed'>
                        {stage.description}
                      </p>
                    </div>

                    {/* Highlights List */}
                    <div className='lg:col-span-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2'>
                      <div className='text-[11px] font-bold text-slate-800 uppercase tracking-wider'>
                        Key Standards:
                      </div>
                      {stage.highlights.map((h, hIdx) => (
                        <div key={hIdx} className='flex items-start gap-2 text-xs text-slate-600'>
                          <CheckCircle2 size={13} className='text-blue-600 mt-0.5 shrink-0' />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── VISUAL INSPECTION & TRACEABILITY SHOWCASE ── */}
      <section className='py-16 bg-slate-900 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div className='text-center max-w-2xl mx-auto mb-12 space-y-3'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30'>
              <Sparkles size={13} />
              <span>Inspection & Metallurgical Integrity</span>
            </div>
            <h3 className='text-2xl sm:text-3xl font-extrabold tracking-tight'>
              Engineered Precision for Critical Procedures
            </h3>
            <p className='text-xs sm:text-sm text-slate-300 leading-relaxed'>
              Rigorous surface passivation, microscopic burr removal, and batch laser serialization prior to international dispatch.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='group relative rounded-3xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl'>
              <div className='h-60 overflow-hidden relative'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src='/images/custom-surgical-kit.jpg'
                  alt='SubMedOrtho Autoclave Surgical Kit Tray'
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent' />
              </div>
              <div className='p-6 space-y-2'>
                <span className='text-[10px] font-extrabold text-blue-400 uppercase tracking-wider'>Cleanroom Sterile Assembly</span>
                <h4 className='text-base font-bold text-white'>Custom Modular Instrument Kits</h4>
                <p className='text-xs text-slate-300 leading-relaxed'>
                  Direct assembly in medical grade silicone cassettes with individual laser slot indexing.
                </p>
              </div>
            </div>

            <div className='group relative rounded-3xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl'>
              <div className='h-60 overflow-hidden relative'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src='/images/implants-trauma-plates.jpg'
                  alt='SubMedOrtho Titanium Locking Compression Trauma Plates'
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent' />
              </div>
              <div className='p-6 space-y-2'>
                <span className='text-[10px] font-extrabold text-blue-400 uppercase tracking-wider'>Orthopedic Metallurgy</span>
                <h4 className='text-base font-bold text-white'>Titanium Trauma & Fixation Plates</h4>
                <p className='text-xs text-slate-300 leading-relaxed'>
                  Color-anodized cortical locking screws and contour-milled anatomical trauma reconstruction plates.
                </p>
              </div>
            </div>

            <div className='group relative rounded-3xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl'>
              <div className='h-60 overflow-hidden relative'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src='/images/implants-joint-replacement.jpg'
                  alt='SubMedOrtho Precision Joint Replacement Prosthesis'
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent' />
              </div>
              <div className='p-6 space-y-2'>
                <span className='text-[10px] font-extrabold text-blue-400 uppercase tracking-wider'>Joint Arthroplasty</span>
                <h4 className='text-base font-bold text-white'>Mirror-Polished Femoral & Tibial Implants</h4>
                <p className='text-xs text-slate-300 leading-relaxed'>
                  Ultra-high precision CNC sculpted condyles and UHMWPE-ready tibial trays with microscopic surface finish.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPORT SHIPPING MODES ── */}
      <section className='py-16 bg-white border-t border-slate-200/80'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          
          <div className='text-center max-w-2xl mx-auto mb-12 space-y-3'>
            <h3 className='text-2xl sm:text-3xl font-extrabold text-slate-900'>
              Flexible Global Freight & Logistics Options
            </h3>
            <p className='text-xs sm:text-sm text-slate-600 leading-relaxed'>
              Tailored shipping channels according to order volume, urgency, and destination customs regulations.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            
            {/* Air Freight */}
            <div className='p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4'>
              <div className='w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600'>
                <Plane size={24} />
              </div>
              <h4 className='text-xl font-bold text-slate-900'>Express Air Courier & Air Cargo</h4>
              <p className='text-xs text-slate-600 leading-relaxed'>
                Ideal for clinical trial batches, hospital urgent orders, and medium wholesale shipments. Dispatched directly from Sialkot Cargo Hub with 4–7 business days worldwide door-to-door transit via DHL, FedEx, or dedicated airlines.
              </p>
              <div className='text-xs text-slate-700 font-semibold flex items-center gap-2 pt-2'>
                <CheckCircle2 size={14} className='text-blue-600' />
                <span>Real-time AWB tracking & customs pre-clearance</span>
              </div>
            </div>

            {/* Sea Freight */}
            <div className='p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4'>
              <div className='w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600'>
                <Ship size={24} />
              </div>
              <h4 className='text-xl font-bold text-slate-900'>Ocean Container Freight (FCL / LCL)</h4>
              <p className='text-xs text-slate-600 leading-relaxed'>
                Designed for high-volume government hospital tenders, multinational medical distributors, and large-scale standard product runs. Full Container Load (FCL) and Less than Container Load (LCL) options via Karachi Seaport.
              </p>
              <div className='text-xs text-slate-700 font-semibold flex items-center gap-2 pt-2'>
                <CheckCircle2 size={14} className='text-blue-600' />
                <span>Optimized freight economics & palletized moisture-barrier packing</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className='py-16 bg-slate-900 text-white text-center'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 space-y-6'>
          <h2 className='text-2xl sm:text-3xl font-extrabold tracking-tight'>
            Need Customized OEM Packaging or Tender Lead Times?
          </h2>
          <p className='text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed'>
            Our export logistics division provides custom barcode labeling, Certificate of Origin (COO), and tailored packing specifications for your destination market.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-4 pt-2'>
            <Link
              href='/quote'
              className='bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3.5 px-7 rounded-xl shadow-lg transition-all'
            >
              Request Wholesale Export Quotation
            </Link>
            <Link
              href='/contact'
              className='bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold py-3.5 px-7 rounded-xl transition-all'
            >
              Speak with Sialkot Logistics Desk
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
