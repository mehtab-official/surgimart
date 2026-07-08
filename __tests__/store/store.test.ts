import { useCartStore, useWishlistStore, useCurrencyStore, useCompareStore, useRecentlyViewedStore } from '@/store'
import { act } from 'react-dom/test-utils'

describe('Zustand Stores', () => {
  beforeEach(() => {
    act(() => {
      useCartStore.getState().clearCart()
      useCartStore.getState().closeCart()
      useWishlistStore.setState({ items: [] })
      useCompareStore.getState().clearAll()
      useRecentlyViewedStore.setState({ items: [] })
      useCurrencyStore.getState().setCurrency('USD')
    })
  })

  describe('CartStore', () => {
    const product = { id: '1', name: 'Scalpel', price: 10, slug: 's', category: 'C', images: [{url: 'u'}] } as any

    it('adds and updates items', () => {
      act(() => useCartStore.getState().addItem(product))
      expect(useCartStore.getState().items[0].qty).toBe(1)
      
      act(() => useCartStore.getState().addItem(product, 2))
      expect(useCartStore.getState().items[0].qty).toBe(3)
      
      act(() => useCartStore.getState().updateQty('1', 5))
      expect(useCartStore.getState().items[0].qty).toBe(5)
      
      act(() => useCartStore.getState().updateQty('1', 0)) // should remove
      expect(useCartStore.getState().items.length).toBe(0)
    })

    it('opens and closes cart', () => {
      act(() => useCartStore.getState().openCart())
      expect(useCartStore.getState().isOpen).toBe(true)
      act(() => useCartStore.getState().closeCart())
      expect(useCartStore.getState().isOpen).toBe(false)
    })
  })

  describe('WishlistStore', () => {
    const p = { id: '1', name: 'S', price: 10, slug: 's' } as any

    it('toggles items', () => {
      act(() => useWishlistStore.getState().toggleItem(p))
      expect(useWishlistStore.getState().isInWishlist('1')).toBe(true)
      act(() => useWishlistStore.getState().toggleItem(p))
      expect(useWishlistStore.getState().isInWishlist('1')).toBe(false)
    })
  })

  describe('CurrencyStore', () => {
    it('converts correctly', () => {
      act(() => useCurrencyStore.getState().setCurrency('PKR'))
      const converted = useCurrencyStore.getState().convert(10)
      expect(converted).toBeGreaterThan(10)
      
      act(() => useCurrencyStore.getState().setCurrency('EUR'))
      expect(useCurrencyStore.getState().currency).toBe('EUR')
    })
  })

  describe('CompareStore', () => {
    it('limits items to 3', () => {
      const p = (id: string) => ({ id, name: id } as any)
      act(() => {
        useCompareStore.getState().addItem(p('1'))
        useCompareStore.getState().addItem(p('2'))
        useCompareStore.getState().addItem(p('3'))
        useCompareStore.getState().addItem(p('4'))
      })
      expect(useCompareStore.getState().items.length).toBe(3)
    })
  })

  describe('RecentlyViewedStore', () => {
    it('limits to 8 items and keeps unique', () => {
      const p = (id: string) => ({ id, name: id } as any)
      act(() => {
        for(let i=1; i<=10; i++) useRecentlyViewedStore.getState().addItem(p(String(i)))
      })
      expect(useRecentlyViewedStore.getState().items.length).toBe(8)
      expect(useRecentlyViewedStore.getState().items[0].id).toBe('10')
    })
  })
})
