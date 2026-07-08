'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'

export function ZoomModal({ src, alt, open, onClose }: {
  src: string; alt: string; open: boolean; onClose: () => void
}) {
  const [scale, setScale] = useState(1)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className='fixed inset-0 bg-black/80 z-50' onClick={onClose} />
          <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
            data-testid='zoom-modal'
            className='fixed inset-4 md:inset-12 z-50 flex items-center justify-center'>
            <div className='relative w-full h-full'>
              <button aria-label='Close Zoom' onClick={onClose} className='absolute top-2 right-2 text-white bg-black/50 p-2 rounded-full z-10'>
                <X size={20} />
              </button>
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10'>
                <button aria-label='Zoom Out' onClick={() => setScale(s => Math.max(1, s - 0.5))} className='bg-white/90 p-2 rounded-full shadow'><ZoomOut size={18}/></button>
                <button aria-label='Zoom In' onClick={() => setScale(s => Math.min(4, s + 0.5))} className='bg-white/90 p-2 rounded-full shadow'><ZoomIn size={18}/></button>
              </div>
              <div className='w-full h-full overflow-auto flex items-center justify-center'>
                <Image src={src} alt={alt} width={1200} height={1200}
                  style={{ transform: `scale(${scale})`, transition: 'transform 0.2s' }}
                  className='object-contain max-w-full max-h-full' />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
