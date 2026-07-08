import { render, screen } from '@testing-library/react'
import NotFound from '@/app/not-found'

describe('NotFound', () => {
  it('renders not found message', () => {
    render(<NotFound />)
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
  })
})
