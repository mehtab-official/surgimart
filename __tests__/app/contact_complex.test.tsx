import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import ContactPage from '@/app/contact/page'

describe('ContactPage Complex Interactions', () => {
  it('submits contact form successfully', async () => {
    render(<ContactPage />)
    
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Usman' } })
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'usman@test.com' } })
      fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Bulk Inquiry' } })
      fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'I want to buy 1000 scalpels please.' } })
      
      fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))
    })
    
    // Form should reset, input should be empty
    expect((screen.getByLabelText(/Name/i) as HTMLInputElement).value).toBe('')
  })

  it('shows validation errors', async () => {
    render(<ContactPage />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))
    })
    expect(screen.getAllByText(/Required/i).length).toBeGreaterThan(0)
  })
})
