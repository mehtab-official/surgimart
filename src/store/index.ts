// src/store/index.ts — All 5 Zustand stores
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product, CartItem, WishlistItem } from '@/types'

// ■■■ Types ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, qty?: number) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

// ■■■ 1. Cart Store ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export const useCartStore = create<CartStore>()(persist(
  (set) => ({
    items: [],
    isOpen: false,
    addItem: (product, qty = 1) => set(state => {
      const existing = state.items.find(i => i.id === product.id)
      if (existing) {
        return { 
          items: state.items.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i),
          isOpen: true
        }
      }
      return { 
        items: [...state.items, {
          id: product.id, name: product.name, price: product.price,
          image: product.images?.[0] || "", category: product.category,
          slug: product.slug, qty
        }],
        isOpen: true
      }
    }),
    removeItem: (id) => set(state => ({
      items: state.items.filter(i => i.id !== id)
    })),
    updateQty: (id, qty) => set(state => {
      if (qty <= 0) return { items: state.items.filter(i => i.id !== id) }
      return { items: state.items.map(i => i.id === id ? { ...i, qty } : i) }
    }),
    clearCart: () => set({ items: [] }),
    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
  }),
  { name: 'surgimart-cart', storage: createJSONStorage(() => localStorage) }
))

// ■■■ 2. Wishlist Store ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export const useWishlistStore = create<{
  items: WishlistItem[]
  addItem: (p: Product) => void
  removeItem: (id: string) => void
  toggleItem: (p: Product) => void
  isInWishlist: (id: string) => boolean
}>()(persist(
  (set, get) => ({
    items: [],
    addItem: (p) => set(s => ({ items: [...s.items, {
      id: p.id, name: p.name, price: p.price,
      image: p.images?.[0] || "", slug: p.slug
    }] })),
    removeItem: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
    toggleItem: (p) => {
      const exists = get().items.some(i => i.id === p.id)
      if (exists) get().removeItem(p.id); else get().addItem(p)
    },
    isInWishlist: (id) => get().items.some(i => i.id === id),
  }),
  { name: 'surgimart-wishlist', storage: createJSONStorage(() => localStorage) }
))

// ■■■ 3. Currency Store ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const RATES: Record<string, number> = {
  USD: 1, AED: 3.67, GBP: 0.79, EUR: 0.92, PKR: 278, SAR: 3.75, QAR: 3.64
}
export const useCurrencyStore = create<{
  currency: string
  rates: typeof RATES
  setCurrency: (c: string) => void
  convert: (priceUSD: number) => number
}>()(persist(
  (set, get) => ({
    currency: 'USD',
    rates: RATES,
    setCurrency: (c) => set({ currency: c }),
    convert: (priceUSD) => {
      const rate = get().rates[get().currency] ?? 1
      return Math.round(priceUSD * rate * 100) / 100
    },
  }),
  { name: 'surgimart-currency', storage: createJSONStorage(() => localStorage) }
))

// ■■■ 4. Compare Store (max 3, no persist) ■■■■■■■■■■■■■■■■■■■■■■■■
export const useCompareStore = create<{
  items: Product[]
  addItem: (p: Product) => void
  removeItem: (id: string) => void
  clearAll: () => void
}>()(set => ({
  items: [],
  addItem: (p) => set(s => {
    if (s.items.length >= 3 || s.items.some(i => i.id === p.id)) return s
    return { items: [...s.items, p] }
  }),
  removeItem: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
  clearAll: () => set({ items: [] }),
}))

// ■■■ 5. Recently Viewed (max 8, persisted) ■■■■■■■■■■■■■■■■■■■■■■■
export const useRecentlyViewedStore = create<{
  items: Product[]
  addItem: (p: Product) => void
}>()(persist(
  (set) => ({
    items: [],
    addItem: (p) => set(s => {
      const filtered = s.items.filter(i => i.id !== p.id)
      return { items: [p, ...filtered].slice(0, 8) }
    }),
  }),
  { name: 'surgimart-recent', storage: createJSONStorage(() => localStorage) }
))
