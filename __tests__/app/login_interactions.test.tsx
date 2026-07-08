import { render, screen, fireEvent, act } from '@testing-library/react'
import LoginPage from '@/app/login/page'
import { signIn } from 'next-auth/react'

jest.mock('next-auth/react', () => ({
  signIn: jest.fn()
}))

describe('LoginPage Interactions', () => {
  it('calls signIn with credentials', async () => {
    render(<LoginPage />)
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })
    
    await act(async () => {
      // Use exact regex to avoid matching "Sign in with Google"
      fireEvent.click(screen.getByRole('button', { name: /^Sign In$/i }))
    })
    
    expect(signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({ email: 'test@test.com' }))
  })

  it('calls signIn with google', async () => {
    render(<LoginPage />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Google/i }))
    })
    expect(signIn).toHaveBeenCalledWith('google', expect.objectContaining({ callbackUrl: '/account' }))
  })
})
