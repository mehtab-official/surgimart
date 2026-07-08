import { render } from '@testing-library/react'
import { StarRating } from '@/components/ui/StarRating'

describe('StarRating', () => {
  it('renders stars accurately', () => {
    const { container } = render(<StarRating rating={4} />)
    // Check for 5 star icons
    expect(container.querySelectorAll('svg').length).toBe(5)
  })
})
