import { render, screen, fireEvent } from '@testing-library/react'
import { ProductDetailClient } from '@/app/product/[slug]/client'
import { useCartStore, useCurrencyStore, useRecentlyViewedStore } from '@/store'

jest.mock('@/store')
jest.mock('@/components/ui/StarRating', () => ({ StarRating: () => <div /> }))
jest.mock('@/components/product/ProductGrid', () => ({ ProductGrid: () => <div /> }))
jest.mock('@/components/product/ZoomModal', () => ({ ZoomModal: () => <div /> }))
jest.mock('@/components/product/QuoteModal', () => ({ QuoteModal: () => <div /> }))

const mockProduct = {
  id: '1', name: 'Scalpel', slug: 'scalpel', price: 10, images: [{ url: '/img1.png' }],
  category: 'Tools', rating: 4.5, reviewCount: 10, inStock: true, stockCount: 50,
  description: 'A sharp tool', specifications: [{ key: 'Material', value: 'Steel' }],
  reviews: []
}

describe('ProductDetailClient', () => {
  beforeEach(() => {
    const cartState = { addItem: jest.fn() }
    const currencyState = { convert: (n: number) => n, currency: '$' }
    const recentState = { addItem: jest.fn() }

    ;(useCartStore as unknown as jest.Mock).mockImplementation(sel => sel ? sel(cartState) : cartState)
    ;(useCurrencyStore as unknown as jest.Mock).mockImplementation(sel => sel ? sel(currencyState) : currencyState)
    ;(useRecentlyViewedStore as unknown as jest.Mock).mockImplementation(sel => sel ? sel(recentState) : recentState)
  })

  it('renders product name and price', () => {
    render(<ProductDetailClient product={mockProduct as any} related={[]} />)
    expect(screen.getByText('Scalpel')).toBeInTheDocument()
    expect(screen.getByText('$ 10.00')).toBeInTheDocument()
  })

  it('switches tabs', () => {
    render(<ProductDetailClient product={mockProduct as any} related={[]} />)
    fireEvent.click(screen.getByText(/Specifications/i))
    expect(screen.getByText('Material')).toBeInTheDocument()
  })

  it('increases quantity', () => {
    render(<ProductDetailClient product={mockProduct as any} related={[]} />)
    const qty = screen.getByText('1')
    expect(qty).toBeInTheDocument()
  })
})
