'use client'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <html lang='en'>
      <body className='min-h-screen flex items-center justify-center bg-slate-50'>
        <div className='text-center space-y-6 p-8'>
          <div className='text-6xl'>⚠️</div>
          <h1 className='text-2xl font-bold text-slate-900'>Something went wrong</h1>
          <p className='text-slate-600 max-w-md'>
            We apologize for the inconvenience. Please try again.
          </p>
          <button
            onClick={reset}
            className='bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700'
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
