'use client'
import { useMemo } from 'react'
import { useCurrencyStore } from '@/store'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/types'

interface Props {
  products: Product[]
  columns?: 3 | 4
  loading?: boolean
}

const GRID_COLS = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
} as const

export function ProductGrid({ products, columns = 4, loading }: Props) {
    const convert = useCurrencyStore(s => s.convert)

  const converted = useMemo(() =>
    products.map(p => ({ ...p, convertedPrice: convert(p.price) })),
    [products, convert]
  )

  const colClass = GRID_COLS[columns]

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 ${colClass} gap-4`}>
        {[...Array(columns * 2)].map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div data-testid='product-grid' className={`grid grid-cols-2 md:grid-cols-3 ${colClass} gap-4`}>
      {converted.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
