import { render, screen } from '@testing-library/react'
import { TrustStrip } from '@/components/homepage/TrustStrip'

describe('TrustStrip', () => {
  it('renders trust stats', () => {
    render(<TrustStrip />)
    expect(screen.getByText('200K+')).toBeInTheDocument()
    expect(screen.getByText('ISO 9001')).toBeInTheDocument()
  })
})
