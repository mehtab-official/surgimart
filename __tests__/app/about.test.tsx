import { render, screen } from '@testing-library/react'
import AboutPage from '@/app/about/page'

describe('AboutPage', () => {
  it('renders about content', () => {
    render(<AboutPage />)
    expect(screen.getByText(/About SurgiMart/i)).toBeInTheDocument()
    expect(screen.getByText(/Our Mission/i)).toBeInTheDocument()
  })
})
