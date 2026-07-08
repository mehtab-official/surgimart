import React from 'react'
import { render, screen } from '@testing-library/react'
import ProductPage from '@/app/product/[slug]/page'
import { getProductBySlug, getRelatedProducts } from '@/lib/products'

jest.mock('@/lib/products')
jest.mock('@/app/product/[slug]/client', () => ({
  ProductDetailClient: ({ product }: any) => <div data-testid="client-render">{product.name}</div>
}))

describe('ProductPage Server Component', () => {
  it('renders product details via client component', async () => {
    ;(getProductBySlug as jest.Mock).mockResolvedValue({ name: 'Scalpel', slug: 'scalpel' })
    ;(getRelatedProducts as jest.Mock).mockResolvedValue([])
    
    // @ts-ignore
    const jsx = await ProductPage({ params: { slug: 'scalpel' } })
    render(jsx)
    expect(screen.getByTestId('client-render')).toHaveTextContent('Scalpel')
  })

  it('renders not found when product is missing', async () => {
    ;(getProductBySlug as jest.Mock).mockResolvedValue(null)
    
    // @ts-ignore
    const jsx = await ProductPage({ params: { slug: 'none' } })
    render(jsx)
    expect(screen.getByText(/Product Not Found/i)).toBeInTheDocument()
  })
})
