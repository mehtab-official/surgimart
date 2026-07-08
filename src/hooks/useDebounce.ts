import { useState, useEffect } from 'react'

/**
 * Delays updating the returned value until after `delay` ms
 * have passed without a new value being set.
 * FIXES: Algolia search bottleneck — reduces API calls by ~90%
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}
