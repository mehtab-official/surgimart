import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/homepage/Hero'

describe('Hero', () => {
  it('renders hero content', () => {
    render(<Hero />)
    expect(screen.getByText(/Premium Surgical.*Instruments/i)).toBeInTheDocument()
  })
})
