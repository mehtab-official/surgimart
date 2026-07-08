import { render, screen } from '@testing-library/react'
import { CategoriesGrid } from '@/components/homepage/CategoriesGrid'

describe('CategoriesGrid', () => {
  it('renders all categories', () => {
    render(<CategoriesGrid />)
    expect(screen.getByText('Surgical')).toBeInTheDocument()
    expect(screen.getByText('Dental')).toBeInTheDocument()
  })
})
