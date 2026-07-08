import { render, screen } from '@testing-library/react'
import ContactPage from '@/app/contact/page'

describe('ContactPage', () => {
  it('renders contact info', () => {
    render(<ContactPage />)
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument()
    expect(screen.getByText(/Get in Touch/i)).toBeInTheDocument()
  })
})
