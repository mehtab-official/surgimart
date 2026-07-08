import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import WishlistPage from '@/app/wishlist/page'
import TrackOrderPage from '@/app/track-order/page'
import LoginPage from '@/app/login/page'
import FAQPage from '@/app/faq/page'
import BlogPage from '@/app/blog/page'
import { useHasMounted } from '@/hooks/useHasMounted'
import { useWishlistStore, useCartStore, useCurrencyStore } from '@/store'

jest.mock('@/hooks/useHasMounted')
jest.mock('@/store')
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}))
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('Basic Pages Rendering', () => {
  beforeEach(() => {
    ;(useHasMounted as jest.Mock).mockReturnValue(true)
    
    const mockStore = (state: any) => (sel: any) => sel ? sel(state) : state
    
    ;(useWishlistStore as unknown as jest.Mock).mockImplementation(mockStore({ items: [], removeItem: jest.fn() }))
    ;(useCartStore as unknown as jest.Mock).mockImplementation(mockStore({ addItem: jest.fn() }))
    ;(useCurrencyStore as unknown as jest.Mock).mockImplementation(mockStore({ convert: (n: number) => n, currency: '$' }))
  })

  it('renders Wishlist page', () => {
    render(<WishlistPage />)
    expect(screen.getByRole('heading', { name: /Wishlist/i })).toBeInTheDocument()
  })

  it('renders Track Order page', () => {
    render(<TrackOrderPage />)
    expect(screen.getByRole('heading', { name: /Track Your Order/i })).toBeInTheDocument()
  })

  it('renders Login page', () => {
    render(<LoginPage />)
    expect(screen.getAllByText(/Sign In/i)[0]).toBeInTheDocument()
  })

  it('renders FAQ page', () => {
    render(<FAQPage />)
    expect(screen.getByRole('heading', { name: /Frequently Asked Questions/i })).toBeInTheDocument()
  })

  it('renders Blog page', () => {
    render(<BlogPage />)
    expect(screen.getByRole('heading', { name: /Blog/i })).toBeInTheDocument()
  })

  it('interacts with Track Order form', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ orderNumber: 'SM-123', status: 'confirmed' })
    })

    render(<TrackOrderPage />)
    fireEvent.change(screen.getByPlaceholderText(/Order Number/i), { target: { value: 'SM-123' } })
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@t.com' } })
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Track/i }))
    })
    
    expect(screen.getByText('SM-123')).toBeInTheDocument()
  })

  it('interacts with FAQ toggles', () => {
    render(<FAQPage />)
    const firstFaq = screen.getByText(/countries/i)
    fireEvent.click(firstFaq)
    expect(screen.getByText(/60\+ countries/i)).toBeInTheDocument()
    fireEvent.click(firstFaq) // toggle off
  })
})
