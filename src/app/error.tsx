'use client'

import { useEffect } from 'react'

export default function Error({
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Something went wrong!</h2>
      <p className="text-slate-600 mb-8 max-w-md">
        An unexpected error has occurred. Our team has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
