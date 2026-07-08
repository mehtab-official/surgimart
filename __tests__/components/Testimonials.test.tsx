import { render, screen } from '@testing-library/react'
import { Testimonials } from '@/components/homepage/Testimonials'

describe('Testimonials', () => {
  it('renders testimonials', () => {
    render(<Testimonials />)
    expect(screen.getByText(/Dr. Ahmed Khan/i)).toBeInTheDocument()
  })
})
