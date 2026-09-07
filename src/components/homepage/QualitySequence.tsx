'use client'

import { Cpu, ShieldCheck, Sparkles, Wrench, Waves, ArrowRight, CheckCircle2 } from 'lucide-react'

const QUALITY_STEPS = [
  {
    step: '01',
    title: 'Computer-Aided Design (CAD)',
    subtitle: 'Precision 3D Engineering',
    icon: Cpu,
    description: 'Every surgical instrument begins with precise 3D CAD modeling and mathematical stress analysis to ensure ergonomic balance, exact jaw alignment, and standard dimensional tolerance.',
    details: ['3D CAD Modeling', 'Finite Element Analysis', 'Custom OEM Tooling Specs']
  },
  {
    step: '02',
    title: 'Quality Control & Inspection',
    subtitle: 'Metallurgical Verification',
    icon: ShieldCheck,
    description: 'Raw medical grade stainless steel (AISI 410/420) and titanium undergo spectroscopic alloy testing and Rockwell hardness testing before any forging or CNC cutting begins.',
    details: ['Alloy Spectrometry', 'Rockwell Hardness (HRC)', 'Raw Material Certification']
  },
  {
    step: '03',
    title: 'Precision Polishing',
    subtitle: 'Anti-Glare Micro Finishing',
    icon: Sparkles,
    description: 'Hand-guided satin, mirror, and matte ceramic bead blasting to eliminate microscopic surface burs and prevent light reflection under high-intensity operating room lighting.',
    details: ['Electropolishing', 'Satin Anti-Glare', 'Non-Reflective Coating']
  },
  {
    step: '04',
    title: 'Surgical Hand Assembly',
    subtitle: 'Master Craftsman Fitting',
    icon: Wrench,
    description: 'Sialkot’s master artisans hand-fit box joints, set tungsten carbide (TC) inserts, and test the smooth ratchet locking tension of every clamp and needle holder individually.',
    details: ['Hand-Set Box Joints', 'Tungsten Carbide Inserts', 'Smooth Ratchet Calibration']
  },
  {
    step: '05',
    title: 'Ultrasonic Cleaning & Passivation',
    subtitle: 'Decontamination & Protection',
    icon: Waves,
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
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5'>
          {QUALITY_STEPS.map((item, idx) => {
            const Icon = item.icon
            return (
              <div 
                key={item.step} 
                className='bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg backdrop-blur-sm'
              >
                <div>
                  
                  {/* Step Number & Icon */}
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-2xl font-black text-blue-500/80 group-hover:text-blue-400 transition-colors'>
                      {item.step}
                    </span>
                    <div className='w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all'>
                      <Icon size={18} />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className='text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1'>
                    {item.subtitle}
                  </div>
                  <h3 className='font-bold text-white text-base mb-3 leading-snug group-hover:text-blue-300 transition-colors'>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className='text-xs text-slate-300 leading-relaxed mb-4'>
                    {item.description}
                  </p>
                </div>

                {/* Details Check List */}
                <div className='pt-3 border-t border-slate-700/60 space-y-1.5'>
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
