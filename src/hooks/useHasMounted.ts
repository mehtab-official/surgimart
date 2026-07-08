import { useState, useEffect } from 'react'

/**
 * Returns false on server render, true after first client render.
 * Use to avoid hydration mismatches with localStorage-backed Zustand.
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
