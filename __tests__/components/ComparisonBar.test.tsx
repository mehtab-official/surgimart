import { render, screen, fireEvent } from '@testing-library/react'
import { ComparisonBar } from '@/components/product/ComparisonBar'
import { useCompareStore, useCurrencyStore } from '@/store'

jest.mock('@/store')

describe('ComparisonBar', () => {
  it('renders when items are present', () => {
    ;(useCompareStore as unknown as jest.Mock).mockReturnValue({
      items: [{ id: '1', name: 'Scalpel', slug: 'scalpel', price: 10, images: [] }],
      removeItem: jest.fn(),
      clearAll: jest.fn()
    })
    ;(useCurrencyStore as unknown as jest.Mock).mockReturnValue({
      currency: 'USD',
      convert: (n: number) => n
    })
    render(<ComparisonBar />)
    expect(screen.getByText('Compare Now')).toBeInTheDocument()
  })
})
