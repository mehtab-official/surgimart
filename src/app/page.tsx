import { Hero } from '@/components/homepage/Hero'
import { TrustStrip } from '@/components/homepage/TrustStrip'
import { CategoriesGrid } from '@/components/homepage/CategoriesGrid'
import { PromoBanners } from '@/components/homepage/PromoBanners'
import { Testimonials } from '@/components/homepage/Testimonials'
import { NewsletterSection } from '@/components/homepage/NewsletterSection'
import { ProductGrid } from '@/components/product/ProductGrid'
import { getFeaturedProducts } from '@/lib/products'
import type { Product } from '@/types'

// M-14: Homepage now fetches and displays featured products
export const dynamic = 'force-dynamic'
export default async function HomePage() {
  let featuredProducts: Product[] = []
  try {
    featuredProducts = await getFeaturedProducts()
  } catch (e) {
    console.warn("Failed to fetch products:", e)
  }

  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoriesGrid />
      <PromoBanners />
      {featuredProducts.length > 0 && (
        <section className='max-w-7xl mx-auto px-4 py-16' data-testid='bestsellers-section'>
          <h2 className='font-lora text-3xl font-bold text-center mb-3'>Bestsellers</h2>
          <p className='text-center text-slate-500 mb-10'>Our most popular surgical instruments</p>
          <ProductGrid products={featuredProducts} columns={4} />
        </section>
      )}
      <Testimonials />
      <NewsletterSection />
    </>
  )
}
