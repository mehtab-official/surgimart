import { renderHook } from '@testing-library/react'
import { useHasMounted } from '@/hooks/useHasMounted'

describe('useHasMounted', () => {
  it('returns true after mount', () => {
    const { result } = renderHook(() => useHasMounted())
    expect(result.current).toBe(true)
  })
})
