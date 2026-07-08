import { cn, generateOrderNumber, convert, formatCurrency, shippingBarPercent, amountToFreeShipping, chunk, truncate } from '@/lib/utils'

describe('lib/utils', () => {
  it('cn joins classes', () => {
    expect(cn('a', 'b')).toBe('a b')
    expect(cn('a', { b: true, c: false })).toBe('a b')
  })
  
  it('generateOrderNumber returns SM- format', () => {
    expect(generateOrderNumber()).toMatch(/^SM-[A-Z0-9]{12}$/)
  })
  
  it('convert handles exchange rates', () => {
    expect(convert(10, 'PKR', { PKR: 280 })).toBe(2800)
    expect(convert(10, 'USD', {})).toBe(10)
    expect(convert(12.345, 'GBP', { GBP: 0.8 })).toBe(9.88)
  })
  
  it('formatCurrency adds symbols', () => {
    expect(formatCurrency(10, 'USD')).toBe('$10.00')
    expect(formatCurrency(10, 'PKR')).toBe('Rs.10.00')
    expect(formatCurrency(10, 'EUR')).toBe('€10.00')
    expect(formatCurrency(10, 'UNKNOWN')).toBe('10.00')
  })
  
  it('shippingBarPercent calculates correct percentage', () => {
    expect(shippingBarPercent(50, 100)).toBe(50)
    expect(shippingBarPercent(150, 100)).toBe(100)
    expect(shippingBarPercent(0, 100)).toBe(0)
  })
  
  it('amountToFreeShipping calculates remainder', () => {
    expect(amountToFreeShipping(75, 100)).toBe(25)
    expect(amountToFreeShipping(125, 100)).toBe(0)
  })
  
  it('chunk splits arrays', () => {
    expect(chunk([1,2,3,4,5], 2)).toEqual([[1,2], [3,4], [5]])
    expect(chunk([], 2)).toEqual([])
  })
  
  it('truncate shortens strings', () => {
    expect(truncate('Hello World', 5)).toBe('Hell…')
    expect(truncate('Hi', 5)).toBe('Hi')
    expect(truncate('Hello', 5)).toBe('Hello')
  })
})
