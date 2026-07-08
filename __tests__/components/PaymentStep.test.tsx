import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PaymentStep } from '@/components/checkout/PaymentStep'
import { useStripe, useElements } from '@stripe/react-stripe-js'

jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: jest.fn(),
  useElements: jest.fn(),
  PaymentElement: () => <div data-testid="payment-element" />
}))

describe('PaymentStep', () => {
  const mockOnComplete = jest.fn()

  it('handles payment success', async () => {
    const mockConfirmPayment = jest.fn().mockResolvedValue({ error: null })
    ;(useStripe as jest.Mock).mockReturnValue({ confirmPayment: mockConfirmPayment })
    ;(useElements as jest.Mock).mockReturnValue({})

    render(<PaymentStep onComplete={mockOnComplete} />)
    fireEvent.submit(screen.getByRole('button', { name: /Pay Now/i }))
    
    await waitFor(() => {
      expect(mockConfirmPayment).toHaveBeenCalled()
      expect(mockOnComplete).toHaveBeenCalled()
    })
  })
})
