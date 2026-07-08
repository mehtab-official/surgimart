import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'

describe('Footer', () => {
  it('renders copyright and links', () => {
    render(<Footer />)
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} SurgiMart`, 'i'))).toBeInTheDocument()
  })
})
