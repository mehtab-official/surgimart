import { render, screen, fireEvent } from '@testing-library/react'
import { ShopClient } from '@/app/shop/ShopClient'
import type { Product } from '@/types'

const mockProducts = [
  { id: '1', name: 'Scalpel A', price: 10, category: 'Surgical', rating: 5, slug: 'a', images: [], isPublished: true, isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Dental B', price: 20, category: 'Dental', rating: 4, slug: 'b', images: [], isPublished: true, isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Scalpel C', price: 5, category: 'Surgical', rating: 3, slug: 'c', images: [], isPublished: true, isFeatured: false, createdAt: new Date(), updatedAt: new Date() },
] as unknown as Product[]

describe('ShopClient Interactions', () => {
  it('filters by category', () => {
    render(<ShopClient initialProducts={mockProducts} />)
    
    // Default: All
    expect(screen.getByText('Scalpel A')).toBeInTheDocument()
    expect(screen.getByText('Dental B')).toBeInTheDocument()
    
    // Filter by Dental
    fireEvent.click(screen.getByTestId('category-filter-dental'))
    
    expect(screen.getByText('Dental B')).toBeInTheDocument()
    expect(screen.queryByText('Scalpel A')).not.toBeInTheDocument()
  })

  it('searches for products', () => {
    render(<ShopClient initialProducts={mockProducts} />)
    
    fireEvent.change(screen.getByPlaceholderText(/Search instruments/i), { target: { value: 'Dental' } })
    
    expect(screen.getByText('Dental B')).toBeInTheDocument()
    expect(screen.queryByText('Scalpel A')).not.toBeInTheDocument()
  })
})
