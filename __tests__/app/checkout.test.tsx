import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import CheckoutPage from '@/app/checkout/page'
import { useCartStore, useCurrencyStore } from '@/store'

jest.mock('@/store')
jest.mock('@stripe/stripe-js', () => ({ loadStripe: jest.fn().mockResolvedValue({}) }))
jest.mock('@stripe/react-stripe-js', () => ({ 
  Elements: ({ children }: any) => <div>{children}</div>,
  useStripe: () => ({}),
  useElements: () => ({}),
}))

jest.mock('@/components/checkout/ShippingStep', () => ({ 
  ShippingStep: ({ onComplete }: any) => (
    <button onClick={() => onComplete({ firstName: 'John', lastName: 'Doe', email: 'j@d.com', phone: '1234567', address1: '123 Main', city: 'Sialkot', country: 'PK' })}>
      Complete Shipping
    </button>
  ) 
}))

jest.mock('@/components/checkout/PaymentStep', () => ({ 
  PaymentStep: ({ onComplete }: any) => (
    <button onClick={() => onComplete()}>
      Complete Payment
    </button>
  ) 
}))

jest.mock('@/components/checkout/ConfirmStep', () => ({ 
  ConfirmStep: ({ orderNumber }: any) => <div>Confirmed: {orderNumber}</div> 
}))

describe('CheckoutPage Flow', () => {
  beforeEach(() => {
    const cartState = { 
        items: [{ id: '1', name: 'Product 1', price: 100, qty: 1, slug: 'p1', image: '/p1.png' }], 
        clearCart: jest.fn() 
    }
    const currencyState = { convert: (n: number) => n, currency: '$' }

    ;(useCartStore as unknown as jest.Mock).mockImplementation((sel: any) => sel ? sel(cartState) : cartState)
    ;(useCurrencyStore as unknown as jest.Mock).mockImplementation((sel: any) => sel ? sel(currencyState) : currencyState)
  })

  it('navigates through the entire checkout flow (Shipping -> Payment -> Confirm)', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ clientSecret: 'pi_test_secret_123' }) }) // create-payment-intent
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ orderNumber: 'SM-ORDER-123' }) }) // orders

    render(<CheckoutPage />)
    
    // Step 1: Shipping
    fireEvent.click(screen.getByText('Complete Shipping'))
    
    await waitFor(() => expect(screen.getByText('Complete Payment')).toBeInTheDocument())
    
    // Step 2: Payment
    fireEvent.click(screen.getByText('Complete Payment'))
    
    await waitFor(() => expect(screen.getByText('Confirmed: SM-ORDER-123')).toBeInTheDocument())
    
    expect(screen.getByText('Confirmed: SM-ORDER-123')).toBeInTheDocument()
  })
})
