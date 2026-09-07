import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Navbar } from '@/components/layout/Navbar'
import { useSession } from 'next-auth/react'
import { useCartStore, useWishlistStore, useCurrencyStore } from '@/store'

jest.mock('next-auth/react')
jest.mock('@/store')
jest.mock('@/hooks/useHasMounted', () => ({ useHasMounted: () => true }))
jest.mock('@/components/search/SearchAutocomplete', () => ({ SearchAutocomplete: () => <div /> }))

describe('Navbar', () => {
  beforeEach(() => {
    ;(useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' })
    const cartState = { items: [], openCart: jest.fn() }
    const wishState = { items: [] }
    const currState = { currency: 'USD', setCurrency: jest.fn() }
    ;(useCartStore as unknown as jest.Mock).mockImplementation((sel: any) => sel ? sel(cartState) : cartState)
    ;(useWishlistStore as unknown as jest.Mock).mockImplementation((sel: any) => sel ? sel(wishState) : wishState)
    ;(useCurrencyStore as unknown as jest.Mock).mockImplementation((sel: any) => sel ? sel(currState) : currState)
  })

  it('renders sign in when unauthenticated', () => {
    render(<Navbar />)
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument()
  })

  it('renders account name when authenticated', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: { user: { name: 'Test User' } }, 
      status: 'authenticated' 
    })
    render(<Navbar />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('displays RFQ quote request action link', () => {
    render(<Navbar />)
    expect(screen.getByTestId('nav-cart-icon')).toBeInTheDocument()
    expect(screen.getByText('Request a Quote')).toBeInTheDocument()
  })
})
