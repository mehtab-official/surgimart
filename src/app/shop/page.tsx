import { getAllProducts } from '@/lib/products'
import { ShopClient } from './ShopClient'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>
}) {
  const sp = await searchParams
  const { products } = await getAllProducts()
  
  return (
    <section>
      <ShopClient 
        initialProducts={products} 
        initialCategory={sp.cat} 
        initialQuery={sp.q} 
      />
    </section>
  )
}
