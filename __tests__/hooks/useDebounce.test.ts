import { renderHook } from '@testing-library/react'
import { useDebounce } from '@/hooks/useDebounce'
import { act } from 'react-dom/test-utils'

describe('useDebounce', () => {
  it('debounces values', async () => {
    jest.useFakeTimers()
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'a', delay: 100 }
    })
    
    expect(result.current).toBe('a')
    
    rerender({ value: 'b', delay: 100 })
    expect(result.current).toBe('a')
    
    act(() => { jest.advanceTimersByTime(100) })
    expect(result.current).toBe('b')
  })
})
