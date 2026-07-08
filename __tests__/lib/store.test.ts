import { useCartStore, useWishlistStore, useCurrencyStore, useCompareStore } from '@/store'

// Mock localStorage for Zustand persist
const localStorageMock = (function() {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { store = {} },
    removeItem: (key: string) => { delete store[key] }
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Zustand Stores', () => {
  describe('useCartStore', () => {
    it('adds an item', () => {
      const product = { id: '1', name: 'Test', price: 10, slug: 'test', images: [], category: 'Tools' }
      useCartStore.getState().addItem(product as any)
      expect(useCartStore.getState().items.length).toBe(1)
    })

    it('updates quantity', () => {
      useCartStore.getState().updateQty('1', 5)
      expect(useCartStore.getState().items[0].qty).toBe(5)
    })

    it('removes an item', () => {
      useCartStore.getState().removeItem('1')
      expect(useCartStore.getState().items.length).toBe(0)
    })
  })

  describe('useCurrencyStore', () => {
    it('converts correctly', () => {
      useCurrencyStore.getState().setCurrency('PKR')
      const converted = useCurrencyStore.getState().convert(10)
      expect(converted).toBe(2780) // 10 * 278
    })
  })

  describe('useCompareStore', () => {
    it('limits to 3 items', () => {
      const state = useCompareStore.getState()
      state.clearAll()
      state.addItem({ id: '1' } as any)
      state.addItem({ id: '2' } as any)
      state.addItem({ id: '3' } as any)
      state.addItem({ id: '4' } as any)
      expect(useCompareStore.getState().items.length).toBe(3)
    })
  })
})
