import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { CookieBanner } from '@/components/ui/CookieBanner'

jest.mock('@/hooks/useHasMounted')
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('CookieBanner', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('shows after delay if not accepted', () => {
    render(<CookieBanner />)
    expect(screen.queryByText(/We use cookies/i)).not.toBeInTheDocument()
    
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    expect(screen.getByText(/We use cookies/i)).toBeInTheDocument()
  })

  it('saves preference and hides on accept', () => {
    render(<CookieBanner />)
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    fireEvent.click(screen.getByText('Accept'))
    expect(localStorage.getItem('cookies-accepted')).toBe('true')
    expect(screen.queryByText(/We use cookies/i)).not.toBeInTheDocument()
  })

  it('saves preference and hides on decline', () => {
    render(<CookieBanner />)
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    fireEvent.click(screen.getByText('Decline'))
    expect(localStorage.getItem('cookies-accepted')).toBe('false')
  })
})
