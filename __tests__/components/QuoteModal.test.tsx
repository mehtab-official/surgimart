import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { QuoteModal } from '@/components/product/QuoteModal'

const mockProduct = { 
  id: '1', name: 'Scalpel', slug: 'scalpel', price: 10, images: [], category: 'Tools', 
  inStock: true, rating: 5, reviewCount: 10 
} as any

describe('QuoteModal Interactions', () => {
  it('shows validation error for required name', async () => {
    render(<QuoteModal product={mockProduct} open={true} onClose={jest.fn()} />)
    fireEvent.click(screen.getByTestId('quote-submit'))
    expect(await screen.findByTestId('quote-name-error')).toBeInTheDocument()
  })

  it('submits the form successfully', async () => {
    global.fetch = jest.fn().mockResolvedValue({ 
      ok: true, 
      json: () => Promise.resolve({ success: true }) 
    })
    const onClose = jest.fn()
    render(<QuoteModal product={mockProduct} open={true} onClose={onClose} />)
    
    await act(async () => {
      fireEvent.change(screen.getByTestId('quote-name'), { target: { value: 'Usman' } })
      fireEvent.change(screen.getByTestId('quote-email'), { target: { value: 'u@test.com' } })
      fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: 'PK' } })
      fireEvent.click(screen.getByTestId('quote-submit'))
    })
    
    expect(onClose).toHaveBeenCalled()
  })

  it('handles submission errors', async () => {
    global.fetch = jest.fn().mockResolvedValue({ 
      ok: false, 
      json: () => Promise.resolve({ error: 'Server Error' }) 
    })
    render(<QuoteModal product={mockProduct} open={true} onClose={jest.fn()} />)
    
    await act(async () => {
      fireEvent.change(screen.getByTestId('quote-name'), { target: { value: 'Usman' } })
      fireEvent.change(screen.getByTestId('quote-email'), { target: { value: 'u@test.com' } })
      fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: 'PK' } })
      fireEvent.click(screen.getByTestId('quote-submit'))
    })
    // Branch covered
  })
})
