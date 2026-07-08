import { render, screen } from '@testing-library/react'
import { PromoBanners } from '@/components/homepage/PromoBanners'

describe('PromoBanners', () => {
  it('renders both banners', () => {
    render(<PromoBanners />)
    expect(screen.getByText(/Wholesale Program/i)).toBeInTheDocument()
    expect(screen.getByText(/Free Shipping/i)).toBeInTheDocument()
  })
})
