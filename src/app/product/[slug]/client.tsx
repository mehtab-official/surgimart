'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ZoomIn, FileText, Phone, Mail, MessageSquare, ShieldCheck, CheckCircle2, Award, Clock } from 'lucide-react'
import { StarRating } from '@/components/ui/StarRating'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ZoomModal } from '@/components/product/ZoomModal'
import { QuoteModal } from '@/components/product/QuoteModal'
import type { Product } from '@/types'

interface Props { 
  product: Product
  related: Product[] 
}

export function ProductDetailClient({ product, related }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [tab, setTab] = useState<'desc'|'specs'|'reviews'>('desc')
  const [zoomOpen, setZoomOpen] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)

  const currentImage = product.images?.[selectedImage] || '/uploads/products/Forceps.png'

  return (
    <div className='min-h-screen bg-slate-50 py-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        
        {/* Breadcrumb Navigation & Back Button */}
        <div className='flex items-center justify-between gap-4 mb-6'>
          <div className='flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-hidden'>
            <Link href='/' className='hover:text-blue-600 shrink-0'>Home</Link>
            <span>/</span>
            <Link href='/shop' className='hover:text-blue-600 shrink-0'>Products Showcase</Link>
            <span>/</span>
            <span className='text-slate-800 font-bold truncate'>{product.name}</span>
          </div>

          <Link
            href='/shop'
            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-sm shrink-0'
          >
            ← Back to Products
          </Link>
        </div>

        {/* Top Product Showcase Card */}
        <div className='bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-start'>
            
            {/* Left: Image Showcase & Gallery */}
            <div className='lg:col-span-6 space-y-4'>
              <div 
                className='relative bg-slate-50 rounded-3xl overflow-hidden h-96 sm:h-[420px] cursor-zoom-in border border-slate-100 flex items-center justify-center' 
                data-testid='product-image'
                onClick={() => setZoomOpen(true)}
              >
                <Image 
                  src={currentImage} 
                  alt={product.name} 
                  fill 
                  className='object-contain p-8' 
                />
                <button 
                  className='absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow hover:bg-white transition-all text-slate-700'
                  aria-label='Zoom image'
                >
                  <ZoomIn size={18} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className='flex gap-3 overflow-x-auto pb-2'>
                  {product.images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 bg-slate-50 transition-all ${
                        i === selectedImage ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Image src={img} alt='' width={80} height={80} className='object-contain p-2' />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Technical Specifications & Direct Rate Inquiry */}
            <div className='lg:col-span-6 space-y-6'>
              
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100'>
                    {product.category}
                  </span>
                  {product.sku && (
                    <span className='text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-full'>
                      SKU: {product.sku}
                    </span>
                  )}
                </div>

                <h1 data-testid='product-name' className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight'>
                  {product.name}
                </h1>

                <div className='flex items-center gap-2 mt-3'>
                  <StarRating rating={product.rating} />
                  <span className='text-xs text-slate-500 font-medium'>
                    ({product.reviewCount || 15} hospital evaluations)
                  </span>
                </div>
              </div>

              {/* Rates Inquiry Box (B2B Showcase Mode) */}
              <div className='p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-lg'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <div className='text-xs font-bold uppercase tracking-wider text-blue-400'>
                      Commercial Export & Hospital Rates
                    </div>
                    <div className='text-lg font-bold text-white'>
                      Pricing Available on Inquire / RFQ
                    </div>
                  </div>
                  <span className='px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30'>
                    In Stock for Export
                  </span>
                </div>

                <p className='text-xs text-slate-300 leading-relaxed'>
                  To discuss bulk procurement rates, OEM laser etching, or customized set packaging, contact our Sialkot sales desk directly.
                </p>

                {/* Main Inquire CTA Buttons */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2'>
                  <Link
                    href={`/quote?product=${encodeURIComponent(product.name)}&sku=${encodeURIComponent(product.sku || '')}`}
                    className='bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md'
                  >
                    <FileText size={14} />
                    <span>Request Quotation (RFQ)</span>
                  </Link>

                  <a
                    href={`https://wa.me/923273961505?text=Hello%20SubMedOrtho,%20I%20am%20interested%20in%20pricing%20for:%20${encodeURIComponent(product.name)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md'
                  >
                    <MessageSquare size={14} />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
              </div>

              {/* Quick Quality Dossier Highlights */}
              <div className='grid grid-cols-2 gap-3 pt-2'>
                <div className='p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1'>
                  <div className='text-[11px] font-bold text-slate-900 flex items-center gap-1.5'>
                    <ShieldCheck size={13} className='text-blue-600' />
                    <span>Certified Metallurgy</span>
                  </div>
                  <div className='text-[11px] text-slate-500'>
                    AISI 410 / 420 Stainless Steel & Titanium
                  </div>
                </div>

                <div className='p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1'>
                  <div className='text-[11px] font-bold text-slate-900 flex items-center gap-1.5'>
                    <Award size={13} className='text-blue-600' />
                    <span>Global Quality Standard</span>
                  </div>
                  <div className='text-[11px] text-slate-500'>
                    ISO 9001:2015 & ISO 13485:2016
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Tabs: Description & Specifications */}
          <div className='mt-16 pt-10 border-t border-slate-100'>
            <div className='flex gap-8 border-b border-slate-200'>
              {(['desc', 'specs', 'reviews'] as const).map(t => (
                <button 
                  key={t} 
                  onClick={() => setTab(t)}
                  className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all ${
                    tab === t 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t === 'desc' ? 'Product Overview' : t === 'specs' ? 'Technical Specifications' : `Doctor Evaluations (${product.reviewCount || 15})`}
                </button>
              ))}
            </div>

            <div className='py-8'>
              {tab === 'desc' && (
                <div className='max-w-4xl space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed'>
                  <p>{product.description || 'Precision surgical instrument manufactured in Sialkot, Pakistan.'}</p>
                  <p>
                    Forged from premium surgical-grade stainless steel with precision heat treatment for optimal tensile strength and corrosion resistance. Suitable for repeated autoclave sterilization cycles under standard hospital CSSD protocols.
                  </p>
                </div>
              )}

              {tab === 'specs' && (
                <div className='max-w-3xl overflow-hidden rounded-2xl border border-slate-200'>
                  <table className='w-full text-xs'>
                    <tbody>
                      {product.specifications && product.specifications.length > 0 ? (
                        product.specifications.map((s, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}>
                            <td className='py-3 px-5 font-bold text-slate-700 w-1/3 border-b border-slate-100'>{s.key}</td>
                            <td className='py-3 px-5 text-slate-600 border-b border-slate-100'>{s.value}</td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr className='bg-slate-50/70'>
                            <td className='py-3 px-5 font-bold text-slate-700 w-1/3'>Material Grade</td>
                            <td className='py-3 px-5 text-slate-600'>German AISI 410 / 420 Stainless Steel</td>
                          </tr>
                          <tr className='bg-white'>
                            <td className='py-3 px-5 font-bold text-slate-700'>Surface Finish</td>
                            <td className='py-3 px-5 text-slate-600'>Satin Anti-Glare Micro-Finish</td>
                          </tr>
                          <tr className='bg-slate-50/70'>
                            <td className='py-3 px-5 font-bold text-slate-700'>Passivation</td>
                            <td className='py-3 px-5 text-slate-600'>ASTM A967 Chemical Nitric Acid Passivated</td>
                          </tr>
                          <tr className='bg-white'>
                            <td className='py-3 px-5 font-bold text-slate-700'>Quality Assurance</td>
                            <td className='py-3 px-5 text-slate-600'>ISO 9001:2015 & ISO 13485:2016 Compliant</td>
                          </tr>
                          <tr className='bg-slate-50/70'>
                            <td className='py-3 px-5 font-bold text-slate-700'>Origin</td>
                            <td className='py-3 px-5 text-slate-600'>Sialkot, Punjab, Pakistan</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 'reviews' && (
                <div className='max-w-3xl space-y-4'>
                  <div className='p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2'>
                    <div className='flex items-center gap-2'>
                      <StarRating rating={5} size='xs' />
                      <span className='text-xs font-bold text-slate-900'>Exceptional box-joint alignment</span>
                    </div>
                    <p className='text-xs text-slate-600 leading-relaxed'>
                      &ldquo;The tension on the ratchets and jaw alignment are on par with German brand instruments. Reliable delivery for our clinic procurement.&rdquo;
                    </p>
                    <div className='text-[11px] text-slate-400'>
                      Dr. Marcus Vance, MD — St. Jude Orthopedic Center, UK
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Related Products Showcase */}
        {related.length > 0 && (
          <div className='mt-16'>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-slate-900 tracking-tight'>
                Related Surgical Showcase Instruments
              </h2>
              <p className='text-xs text-slate-500 mt-0.5'>
                Browse additional instruments in the {product.category} category.
              </p>
            </div>
            <ProductGrid products={related} columns={4} />
          </div>
        )}

      </div>

      {/* Modals */}
      <ZoomModal open={zoomOpen} onClose={() => setZoomOpen(false)} src={currentImage} alt={product.name} />
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} product={product} />
    </div>
  )
}
