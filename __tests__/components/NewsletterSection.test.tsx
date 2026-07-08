import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NewsletterSection } from '@/components/homepage/NewsletterSection'

describe('NewsletterSection', () => {
  it('submits successfully', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
    render(<NewsletterSection />)
    
    const input = screen.getByTestId('newsletter-input')
    fireEvent.change(input, { target: { value: 'test@test.com' } })
    fireEvent.click(screen.getByTestId('newsletter-submit'))
    
    await waitFor(() => {
      expect(screen.getByTestId('newsletter-success')).toBeInTheDocument()
    })
  })
})
