import { render, screen } from '@testing-library/react'
import { ShopClient } from '@/app/shop/ShopClient'

describe('ShopClient', () => {
  it('mounts and renders title', () => {
    render(<ShopClient initialProducts={[]} />)
    expect(screen.getByText(/Shop Instruments/i)).toBeInTheDocument()
    expect(screen.getByTestId('category-filter-all')).toBeInTheDocument()
  })
})
