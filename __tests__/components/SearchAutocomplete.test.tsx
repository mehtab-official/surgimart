import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete'
import { searchProducts } from '@/app/actions/search'
import { useRouter } from 'next/navigation'

jest.mock('@/app/actions/search')
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }))

describe('SearchAutocomplete', () => {
  it('searches and displays results', async () => {
    ;(searchProducts as jest.Mock).mockResolvedValue([{ objectID: '1', name: 'Scalpel', slug: 'scalpel', price: 10, category: 'Tools' }])
    
    render(<SearchAutocomplete />)
    const input = screen.getByTestId('search-input')
    
    fireEvent.change(input, { target: { value: 'scalpel' } })
    
    await waitFor(() => {
      expect(screen.getByTestId('search-dropdown')).toBeInTheDocument()
      expect(screen.getByText('Scalpel')).toBeInTheDocument()
    })
  })
})
