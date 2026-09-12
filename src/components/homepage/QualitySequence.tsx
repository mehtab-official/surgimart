'use client'

import { Cpu, ShieldCheck, Sparkles, Wrench, Waves, ArrowRight, CheckCircle2 } from 'lucide-react'

const QUALITY_STEPS = [
  {
    step: '01',
    title: 'Computer-Aided Design (CAD)',
    subtitle: 'Precision 3D Engineering',
    icon: Cpu,
    image: '/images/quality-step-01-cad.jpg',
    description: 'Every surgical instrument begins with precise 3D CAD modeling and mathematical stress analysis to ensure ergonomic balance, exact jaw alignment, and standard dimensional tolerance.',
    details: ['3D CAD Modeling', 'Finite Element Analysis', 'Custom OEM Tooling Specs']
  },
  {
    step: '02',
    title: 'Quality Control & Inspection',
    subtitle: 'Metallurgical Verification',
    icon: ShieldCheck,
    image: '/images/quality-step-02-qc.jpg',
    description: 'Raw medical grade stainless steel (AISI 410/420) and titanium undergo spectroscopic alloy testing and Rockwell hardness testing before any forging or CNC cutting begins.',
    details: ['Alloy Spectrometry', 'Rockwell Hardness (HRC)', 'Raw Material Certification']
  },
  {
    step: '03',
    title: 'Precision Polishing',
    subtitle: 'Anti-Glare Micro Finishing',
    icon: Sparkles,
    image: '/images/quality-step-03-polishing.jpg',
    description: 'Hand-guided satin, mirror, and matte ceramic bead blasting to eliminate microscopic surface burs and prevent light reflection under high-intensity operating room lighting.',
    details: ['Electropolishing', 'Satin Anti-Glare', 'Non-Reflective Coating']
  },
  {
    step: '04',
    title: 'Surgical Hand Assembly',
    subtitle: 'Master Craftsman Fitting',
    icon: Wrench,
    image: '/images/quality-step-04-assembly.jpg',
    description: 'Sialkot’s master artisans hand-fit box joints, set tungsten carbide (TC) inserts, and test the smooth ratchet locking tension of every clamp and needle holder individually.',
    details: ['Hand-Set Box Joints', 'Tungsten Carbide Inserts', 'Smooth Ratchet Calibration']
  },
  {
    step: '05',
    title: 'Ultrasonic Cleaning & Passivation',
    subtitle: 'Decontamination & Protection',
    icon: Waves,
    image: '/images/quality-step-05-cleaning.jpg',
    description: 'Multi-stage ultrasonic bath cleaning followed by chemical nitric acid passivation to form a protective chromium oxide barrier, preventing oxidation, staining, and autoclave corrosion.',
    details: ['Ultrasonic Cavitation', 'ASTM A967 Passivation', 'Autoclave Resistance Test']
  }
]

export function QualitySequence() {
  return (
    <section className='py-20 bg-slate-900 text-white relative overflow-hidden'>
      
      {/* Decorative Glow */}
      <div className='absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 relative z-10'>
        
        {/* Header Section */}
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-4'>
          <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30'>
            <ShieldCheck size={14} className='text-blue-400' />
            <span>Manufacturing Excellence</span>
          </div>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white'>
            Quality Management as the <br />
            <span className='bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent'>
              Finishing Touch
            </span>
          </h2>
          <p className='text-sm sm:text-base text-slate-300 leading-relaxed font-normal'>
            From CAD design in Sialkot to final ultrasonic passivation, our 5-step precision sequence guarantees instruments that perform flawlessly in critical surgical environments.
          </p>
        </div>

        {/* 5-Step Process Timeline Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5'>
          {QUALITY_STEPS.map((item) => {
            const Icon = item.icon
            return (
              <div 
                key={item.step} 
                className='bg-slate-800/90 rounded-3xl border border-slate-700/80 hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 shadow-xl backdrop-blur-sm overflow-hidden'
              >
                <div>
                  {/* Step Image Container */}
                  <div className='relative h-44 w-full overflow-hidden bg-slate-950'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className='w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 brightness-95 group-hover:brightness-105'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent' />
                    
                    {/* Floating Step Badge & Icon */}
                    <div className='absolute top-3 left-3 right-3 flex items-center justify-between'>
                      <span className='px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/20 text-xs font-black text-blue-400 tracking-wider shadow-lg'>
                        STEP {item.step}
                      </span>
                      <div className='w-8 h-8 rounded-lg bg-blue-600/80 backdrop-blur-md border border-blue-400/40 flex items-center justify-center text-white shadow-lg'>
                        <Icon size={15} />
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className='p-5 pt-4'>
                    <div className='text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1'>
                      {item.subtitle}
                    </div>
                    <h3 className='font-bold text-white text-base mb-2.5 leading-snug group-hover:text-blue-300 transition-colors'>
                      {item.title}
                    </h3>
                    <p className='text-xs text-slate-300 leading-relaxed mb-4'>
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Details Check List */}
                <div className='px-5 pb-5 pt-3 border-t border-slate-700/60 space-y-1.5 bg-slate-800/40'>
                  {item.details.map((d, dIdx) => (
                    <div key={dIdx} className='flex items-center gap-1.5 text-[11px] text-slate-400'>
                      <CheckCircle2 size={12} className='text-blue-400 shrink-0' />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
