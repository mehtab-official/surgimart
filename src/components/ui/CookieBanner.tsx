'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted')
    if (!accepted) setTimeout(() => setVisible(true), 1500)
  }, [])

  const accept = () => { localStorage.setItem("cookies-accepted", "true"); setVisible(false) }
  const decline = () => { localStorage.setItem("cookies-accepted", "false"); setVisible(false) }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className='fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm
          bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl z-50'>
          <p className='text-sm text-slate-700 mb-4'>
            We use cookies to improve your experience.
            <a href='/privacy' className='text-blue-600 underline ml-1'>Learn more</a>
          </p>
          <div className='flex gap-3'>
            <button onClick={accept}
              className='flex-1 bg-blue-600 text-white text-sm font-medium py-2 rounded-lg'>
              Accept
            </button>
            <button onClick={decline}
              className='flex-1 border border-slate-300 text-sm py-2 rounded-lg'>
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
