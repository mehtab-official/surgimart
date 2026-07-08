import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '@/components/product/ProductCard'
import { useCartStore, useWishlistStore, useCurrencyStore, useCompareStore } from '@/store'

jest.mock('@/store', () => ({
  useCartStore: jest.fn(),
  useWishlistStore: jest.fn(),
  useCurrencyStore: jest.fn(),
  useCompareStore: jest.fn(),
}))

const mockProduct = {
  id: '1',
  name: 'Scalpel #10',
  slug: 'scalpel-10',
  price: 25.99,
  category: 'Surgical Tools',
  images: [{ url: 'http://example.com/img.png' }],
  inStock: true,
  rating: 4.5
}

describe('ProductCard', () => {
  const addItem = jest.fn()
  const toggleItem = jest.fn()
  const addCompare = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock the hook to handle selectors by just returning the full mock state
    // This works if the component does useCartStore(s => s.addItem)
    ;(useCurrencyStore as unknown as jest.Mock).mockImplementation((selector) => 
      selector ? selector({ convert: (n: number) => n, currency: '$' }) : { convert: (n: number) => n, currency: '$' }
    )
    ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => 
      selector ? selector({ addItem }) : { addItem }
    )
    ;(useWishlistStore as unknown as jest.Mock).mockImplementation((selector) => 
      selector ? selector({ toggleItem, isInWishlist: () => false }) : { toggleItem, isInWishlist: () => false }
    )
    ;(useCompareStore as unknown as jest.Mock).mockImplementation((selector) => 
      selector ? selector({ addItem: addCompare, items: [] }) : { addItem: addCompare, items: [] }
    )
  })

  it('renders product details', () => {
    render(<ProductCard product={mockProduct as any} />)
    expect(screen.getByText('Scalpel #10')).toBeInTheDocument()
    expect(screen.getByText(/25\.99/)).toBeInTheDocument()
  })

  it('shows out of stock badge when appropriate', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false }
    render(<ProductCard product={outOfStockProduct as any} />)
    expect(screen.getAllByText(/Out of Stock/i).length).toBeGreaterThan(0)
  })

  it('toggles wishlist item', () => {
    render(<ProductCard product={mockProduct as any} />)
    fireEvent.click(screen.getByRole('button', { name: /Add to Wishlist/i }))
    expect(toggleItem).toHaveBeenCalled()
  })

  it('adds item to cart', () => {
    render(<ProductCard product={mockProduct as any} />)
    fireEvent.click(screen.getByRole('button', { name: /Add to Cart/i }))
    expect(addItem).toHaveBeenCalledWith(mockProduct, 1)
  })
})
