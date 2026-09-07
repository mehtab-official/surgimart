import { Hero } from '@/components/homepage/Hero'
import { FeaturedProducts } from '@/components/homepage/FeaturedProducts'
import { QualitySequence } from '@/components/homepage/QualitySequence'
import { EventsSection } from '@/components/homepage/EventsSection'
import { Testimonials } from '@/components/homepage/Testimonials'
import { NewsletterSection } from '@/components/homepage/NewsletterSection'
import { CategoriesGrid } from '@/components/homepage/CategoriesGrid'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section (Precision Surgical Instruments Banner & RFQ CTAs) */}
      <Hero />

      {/* 2. Featured Hot Selling Products & 360 Video Boxes */}
      <FeaturedProducts />

      {/* 3. Primary Export Categories Showcase */}
      <CategoriesGrid />

      {/* 4. Quality Management as the Finishing Touch (5-Step CAD to Cleaning Process) */}
      <QualitySequence />

      {/* 5. Medical Expos & International Trade Fairs */}
      <EventsSection />

      {/* 6. Doctor & Foreign Surgeon Reviews */}
      <Testimonials />

      {/* 7. Newsletter & Export Updates */}
      <NewsletterSection />
    </>
  )
}
