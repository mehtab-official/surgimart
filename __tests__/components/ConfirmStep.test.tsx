import { render, screen } from '@testing-library/react'
import { ConfirmStep } from '@/components/checkout/ConfirmStep'

describe('ConfirmStep', () => {
  it('renders order number', () => {
    render(<ConfirmStep orderNumber="SM-12345678" />)
    expect(screen.getByText('SM-12345678')).toBeInTheDocument()
    expect(screen.getByText(/Order Confirmed!/i)).toBeInTheDocument()
  })
})
