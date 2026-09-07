import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Calendar, Clock, User, ArrowRight, Tag, Sparkles, CheckCircle2 } from 'lucide-react'
import { BLOG_POSTS_DATA } from '@/shared/data/blogs'

export const metadata: Metadata = {
  title: 'Surgical Insights & Manufacturing Technical Blog | SubMedOrtho',
  description: 'Technical guides, metallurgy analysis (AISI 410 vs 420), Sialkot surgical manufacturing, orthopedic locking plates, and sterilization protocols.',
  keywords: [
    'surgical instrument manufacturing',
    'Sialkot surgical export',
    'medical grade stainless steel',
    'orthopedic locking plates',
    'surgical scissors care',
    'ISO 13485 medical devices'
  ]
}

export default function BlogPage() {
  const featuredPost = BLOG_POSTS_DATA[0]
  const otherPosts = BLOG_POSTS_DATA.slice(1)

  return (
    <div className='min-h-screen bg-slate-50'>
      
      {/* ── HERO BANNER WITH BACKGROUND IMAGE ── */}
      <section className='relative text-white py-16 sm:py-24 overflow-hidden bg-slate-950'>
        {/* Background Image & Adaptive Gradient Overlays - Darkened Text Zone */}
        <div className='absolute inset-0 z-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src='/images/image3.jpeg' 
            alt='Distal Femoral Nail Instrument Set SubMedOrtho' 
            className='w-full h-full object-cover object-right sm:object-center opacity-65 filter brightness-105 contrast-110'
          />
          {/* Left Scrim: Solid dark protection behind text side, fading into bright image on right */}
          <div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 via-45% to-slate-950/25' />
          <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50' />
          <div className='absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15' />
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 relative z-10'>
          <div className='mb-6'>
            <Link 
              href='/'
              className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors'
            >
              ← Back to Home
            </Link>
          </div>

          <div className='max-w-3xl'>
            <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-400/30 backdrop-blur-md'>
              <BookOpen size={13} />
              <span>Technical Engineering & Clinical Insights</span>
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6'>
              Surgical Manufacturing <span className='text-blue-400'>& Industry Blog</span>
            </h1>
            <p className='text-lg sm:text-xl text-slate-300 font-medium leading-relaxed mb-8'>
              Technical articles on metallurgy, orthopedic trauma fixation systems, Sialkot craftsmanship, and autoclave maintenance protocols for healthcare professionals and hospital buyers.
            </p>
            <div className='flex flex-wrap gap-4'>
              <Link
                href='/catalogue'
                className='inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all'
              >
                Download Product Catalogues
              </Link>
              <Link
                href='/quote'
                className='inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 transition-all backdrop-blur-md'
              >
                Request Bulk Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED BLOG POST (TOP SEO ARTICLE) ── */}
      <section className='py-12 border-b border-slate-200/80 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          
          <div className='text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 flex items-center gap-1.5'>
            <Sparkles size={14} />
            <span>Featured Technical Guide</span>
          </div>

          <div className='bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden'>
            <div className='absolute inset-0 z-0 opacity-20 pointer-events-none'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredPost.image || '/images/surgical-instruments-blue.jpg'}
                alt='Featured Guide'
                className='w-full h-full object-cover filter brightness-105 contrast-110'
              />
              <div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30' />
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10'>
              
              <div className='lg:col-span-8 space-y-4'>
                <div className='flex flex-wrap items-center gap-3 text-xs text-slate-400'>
                  <span className='px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30'>
                    {featuredPost.category}
                  </span>
                  <span className='flex items-center gap-1'><Calendar size={12} /> {featuredPost.publishedAt}</span>
                  <span>•</span>
                  <span className='flex items-center gap-1'><Clock size={12} /> {featuredPost.readTime}</span>
                </div>

                <h2 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug'>
                  <Link href={`/blog/${featuredPost.slug}`} className='hover:text-blue-400 transition-colors'>
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className='text-xs sm:text-sm text-slate-300 leading-relaxed font-normal'>
                  {featuredPost.excerpt}
                </p>

                {/* Keywords Chips */}
                <div className='flex flex-wrap gap-1.5 pt-2'>
                  {featuredPost.keywords.slice(0, 4).map(kw => (
                    <span key={kw} className='text-[10px] font-medium bg-white/10 text-slate-300 px-2 py-0.5 rounded'>
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className='lg:col-span-4 flex flex-col justify-between h-full space-y-6 lg:border-l lg:border-slate-800 lg:pl-8'>
                <div className='space-y-2 text-xs text-slate-400'>
                  <div className='text-slate-200 font-bold'>Author:</div>
                  <div className='text-white font-semibold'>{featuredPost.author.name}</div>
                  <div className='text-[11px]'>{featuredPost.author.role}</div>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className='inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/30 self-start sm:self-auto'
                >
                  <span>Read Full Technical Guide</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── ALL BLOG ARTICLES GRID ── */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          
          <div className='mb-10'>
            <h3 className='text-2xl font-bold text-slate-900 tracking-tight'>
              Latest Medical Engineering & Export Articles
            </h3>
            <p className='text-xs text-slate-500 mt-1'>
              Curated by the SubMedOrtho metallurgical, sterilization, and export compliance engineering divisions.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {otherPosts.map(post => (
              <article 
                key={post.slug}
                className='bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group'
              >
                <div>
                  {/* Article Thumbnail */}
                  {post.image && (
                    <div className='relative h-44 w-full overflow-hidden bg-slate-900'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt={post.title}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent' />
                      <div className='absolute top-3 left-3'>
                        <span className='font-bold uppercase tracking-wider text-white bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] shadow-sm'>
                          {post.category}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className='p-6 space-y-3'>
                    
                    {/* Time */}
                    <div className='flex items-center justify-between text-xs text-slate-500'>
                      <span className='flex items-center gap-1 text-[11px] font-semibold text-slate-500'>
                        <Clock size={11} /> {post.readTime}
                      </span>
                    </div>

                  {/* Title */}
                  <h4 className='text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug'>
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h4>

                  {/* Excerpt */}
                  <p className='text-xs text-slate-600 leading-relaxed line-clamp-3'>
                    {post.excerpt}
                  </p>

                    {/* Keywords */}
                    <div className='flex flex-wrap gap-1 pt-1'>
                      {post.keywords.slice(0, 3).map(kw => (
                        <span key={kw} className='text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded'>
                          #{kw}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Footer Author & Read Link */}
                <div className='pt-6 border-t border-slate-100 mt-6 flex items-center justify-between'>
                  <div className='text-[11px] text-slate-500'>
                    <div className='font-bold text-slate-800'>{post.author.name}</div>
                    <div className='text-[10px]'>{post.publishedAt}</div>
                  </div>

                  <Link 
                    href={`/blog/${post.slug}`}
                    className='inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700'
                  >
                    <span>Read Article</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

              </article>
            ))}
          </div>

        </div>
      </section>

    </div>
  )
}
