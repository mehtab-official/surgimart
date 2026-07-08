import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ZoomModal } from '@/components/product/ZoomModal'

describe('ZoomModal', () => {
  it('renders and allows scaling when open', () => {
    const onClose = jest.fn()
    render(<ZoomModal open={true} onClose={onClose} src="/img.png" alt="Test Img" />)
    
    // Check image
    const img = screen.getByAltText('Test Img')
    expect(img).toBeInTheDocument()
    
    // Zoom in
    fireEvent.click(screen.getByLabelText('Zoom In'))
    
    // Zoom out
    fireEvent.click(screen.getByLabelText('Zoom Out'))
    
    // Close
    fireEvent.click(screen.getByLabelText('Close Zoom'))
    expect(onClose).toHaveBeenCalled()
  })

  it('does not render when closed', () => {
    render(<ZoomModal open={false} onClose={jest.fn()} src="/img.png" alt="X" />)
    expect(screen.queryByTestId('zoom-modal')).not.toBeInTheDocument()
  })
})
