import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import WholesalePage from '@/app/wholesale/page'

describe('WholesalePage', () => {
  it('validates required fields', async () => {
    render(<WholesalePage />)
    
    fireEvent.click(screen.getByText(/Submit Application/i))
    
    await waitFor(() => {
      expect(screen.getByTestId('wholesale-firstname-error')).toBeInTheDocument()
      expect(screen.getByTestId('wholesale-email-error')).toBeInTheDocument()
    })
  })
})
