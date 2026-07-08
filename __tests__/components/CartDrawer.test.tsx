import { render, screen, fireEvent } from '@testing-library/react'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { useCartStore, useCurrencyStore } from '@/store'

jest.mock('@/store')

describe('CartDrawer', () => {
  const mockRemoveItem = jest.fn()
  const mockUpdateQty = jest.fn()
  
  beforeEach(() => {
    ;(useCartStore as unknown as jest.Mock).mockReturnValue({
      items: [{ id: '1', name: 'Scalpel', slug: 'scalpel', price: 10, qty: 1, image: '/1.png' }],
      removeItem: mockRemoveItem,
      updateQty: mockUpdateQty,
      isOpen: true,
      closeCart: jest.fn()
    })
    ;(useCurrencyStore as unknown as jest.Mock).mockReturnValue({ convert: (n: number) => n, currency: '$' })
  })

  it('renders items and handles updates', () => {
    render(<CartDrawer />)
    expect(screen.getByText('Scalpel')).toBeInTheDocument()
    
    // Test increment
    fireEvent.click(screen.getByTestId('inc-1'))
    expect(mockUpdateQty).toHaveBeenCalledWith('1', 2)

    // Test decrement
    fireEvent.click(screen.getByTestId('dec-1'))
    expect(mockUpdateQty).toHaveBeenCalledWith('1', 0)

    // Test remove
    fireEvent.click(screen.getByTestId('remove-1'))
    expect(mockRemoveItem).toHaveBeenCalledWith('1')
  })
})
