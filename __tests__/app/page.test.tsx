import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import HomePage from '@/app/page'
import { getFeaturedProducts } from '@/lib/products'
import type { Product } from '@/types'

// Mock the products lib
jest.mock('@/lib/products', () => ({
  getFeaturedProducts: jest.fn(),
}))

// Mock the components
jest.mock('@/components/homepage/Hero', () => ({ Hero: () => <div>Hero</div> }))
jest.mock('@/components/homepage/TrustStrip', () => ({ TrustStrip: () => <div>TrustStrip</div> }))
jest.mock('@/components/homepage/CategoriesGrid', () => ({ CategoriesGrid: () => <div>CategoriesGrid</div> }))
jest.mock('@/components/homepage/PromoBanners', () => ({ PromoBanners: () => <div>PromoBanners</div> }))
jest.mock('@/components/homepage/Testimonials', () => ({ Testimonials: () => <div>Testimonials</div> }))
jest.mock('@/components/homepage/NewsletterSection', () => ({ NewsletterSection: () => <div>NewsletterSection</div> }))
jest.mock('@/components/product/ProductGrid', () => ({ ProductGrid: () => <div>ProductGrid</div> }))

describe('HomePage', () => {
  it('renders Bestsellers section when products are available', async () => {
    const mockProducts = [{ id: '1', name: 'Instrument', price: 100, slug: 'instrument', category: 'Surgical', image: '/img.png' }]
    ;(getFeaturedProducts as jest.Mock).mockResolvedValue(mockProducts)

    const Page = await HomePage()
    const { getByText } = render(Page)

    expect(getByText('Bestsellers')).toBeInTheDocument()
    expect(getByText('ProductGrid')).toBeInTheDocument()
  })

  it('does not render Bestsellers section when no products', async () => {
    ;(getFeaturedProducts as jest.Mock).mockResolvedValue([])

    const Page = await HomePage()
    const { queryByText } = render(Page)

    expect(queryByText('Bestsellers')).not.toBeInTheDocument()
  })
})
