import { render, screen, fireEvent } from '@testing-library/react'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { useCartStore, useCurrencyStore } from '@/store'

jest.mock('@/store')

describe('CartDrawer Logic', () => {
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

  it('handles item removal and quantity updates', () => {
    render(<CartDrawer />)
    fireEvent.click(screen.getByTestId('inc-1'))
    expect(mockUpdateQty).toHaveBeenCalledWith('1', 2)
    
    fireEvent.click(screen.getByTestId('remove-1'))
    expect(mockRemoveItem).toHaveBeenCalledWith('1')
  })
})
