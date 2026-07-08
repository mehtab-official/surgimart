import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useCurrencyStore, useWishlistStore, useCartStore, useCompareStore } from '@/store'

jest.mock('@/store')

describe('ProductGrid', () => {
  beforeEach(() => {
    const currencyState = { convert: (n: number) => n, currency: '$' }
    const wishlistState = { toggleItem: jest.fn(), isInWishlist: jest.fn().mockReturnValue(false) }
    const cartState = { addItem: jest.fn() }
    const compareState = { addItem: jest.fn(), items: [] }

    ;(useCurrencyStore as unknown as jest.Mock).mockImplementation(sel => sel ? sel(currencyState) : currencyState)
    ;(useWishlistStore as unknown as jest.Mock).mockImplementation(sel => sel ? sel(wishlistState) : wishlistState)
    ;(useCartStore as unknown as jest.Mock).mockImplementation(sel => sel ? sel(cartState) : cartState)
    ;(useCompareStore as unknown as jest.Mock).mockImplementation(sel => sel ? sel(compareState) : compareState)
  })

  it('renders products', () => {
    const products = [{ 
      id: '1', name: 'Scalpel', price: 10, 
      images: [{url: '/img1.png'}], slug: 'scalpel', 
      category: 'Tools', rating: 5, reviewCount: 10, inStock: true 
    }] as any
    render(<ProductGrid products={products} columns={3} />)
    expect(screen.getByText('Scalpel')).toBeInTheDocument()
  })

  it('renders loading skeletons', () => {
    render(<ProductGrid products={[]} loading={true} columns={4} />)
    // 4 columns * 2 rows = 8 skeletons
    const skeletons = screen.getAllByTestId('product-card-skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
