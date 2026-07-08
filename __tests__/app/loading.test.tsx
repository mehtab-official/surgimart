import { render, screen } from '@testing-library/react'
import Loading from '@/app/loading'

describe('Loading', () => {
  it('renders loading spinner', () => {
    render(<Loading />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})
