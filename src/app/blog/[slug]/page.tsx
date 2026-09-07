import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, User, ArrowLeft, Tag, Share2, ShieldCheck, CheckCircle2, FileText, Send } from 'lucide-react'
import { BLOG_POSTS_DATA } from '@/shared/data/blogs'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS_DATA.find(p => p.slug === slug)
  if (!post) return { title: 'Article Not Found' }

  return {
    title: `${post.title} | SubMedOrtho Technical Insights`,
    description: post.excerpt,
    keywords: post.keywords,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS_DATA.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <div className='min-h-screen bg-slate-50 py-12'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6'>
        
        {/* Back Link */}
        <Link 
          href='/blog'
          className='inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 mb-8 transition-colors'
        >
          <ArrowLeft size={14} />
          <span>Back to All Technical Articles</span>
        </Link>

        {/* Article Container */}
        <article className='bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm'>
          
          {/* Category & Meta */}
          <div className='flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4'>
            <span className='px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold uppercase tracking-wider text-[11px]'>
              {post.category}
            </span>
            <span className='flex items-center gap-1'><Calendar size={13} /> {post.publishedAt}</span>
            <span>•</span>
            <span className='flex items-center gap-1'><Clock size={13} /> {post.readTime}</span>
          </div>

          {/* Title & Subtitle */}
          <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4'>
            {post.title}
          </h1>

          <p className='text-base sm:text-lg text-slate-600 font-medium leading-relaxed pb-6 border-b border-slate-100 mb-8'>
            {post.subtitle}
          </p>

          {/* Author Byline */}
          <div className='flex items-center justify-between pb-8 border-b border-slate-100 mb-8'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 font-bold text-sm'>
                <User size={18} />
              </div>
              <div>
                <div className='text-sm font-bold text-slate-900'>{post.author.name}</div>
                <div className='text-xs text-slate-500'>{post.author.role}</div>
              </div>
            </div>
            <div className='text-xs text-slate-400 font-medium'>
              ISO 13485:2016 Compliant Reference
            </div>
          </div>

          {/* Article Visual Showcase */}
          {post.image && (
            <div className='relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 mb-8 shadow-md group'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-100'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent' />
              <div className='absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs'>
                <span className='font-semibold bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20'>
                  SubMedOrtho Technical Engineering
                </span>
                <span className='text-slate-300 font-mono text-[11px] hidden sm:inline'>
                  Sialkot Metallurgical Laboratory
                </span>
              </div>
            </div>
          )}

          {/* Content Paragraphs */}
          <div className='space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed font-normal'>
            {post.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Key Takeaway Box */}
          <div className='my-10 p-6 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-3'>
            <div className='flex items-center gap-2 text-blue-900 font-bold text-sm'>
              <ShieldCheck size={18} className='text-blue-600' />
              <span>SubMedOrtho Manufacturing Standards</span>
            </div>
            <p className='text-xs text-slate-700 leading-relaxed'>
              All instruments mentioned in this technical paper are manufactured in accordance with strict dimensional blueprints, ASTM stainless steel standards, and batch hardness testing protocols in Sialkot, Pakistan.
            </p>
          </div>

          {/* SEO Keywords Tags */}
          <div className='pt-6 border-t border-slate-100'>
            <div className='text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5'>
              <Tag size={13} />
              <span>Related Keywords & Topics</span>
            </div>
            <div className='flex flex-wrap gap-2'>
              {post.keywords.map(kw => (
                <span key={kw} className='text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium'>
                  #{kw}
                </span>
              ))}
            </div>
          </div>

        </article>

        {/* Post-Article RFQ Box */}
        <div className='mt-10 bg-slate-900 text-white rounded-3xl p-8 text-center sm:text-left sm:flex items-center justify-between gap-6 shadow-xl'>
          <div>
            <h3 className='text-xl font-bold'>Procuring Instruments for Your Hospital or Tender?</h3>
            <p className='text-xs text-slate-300 mt-1 max-w-lg'>
              Request custom samples, OEM laser marking, and wholesale export pricing direct from our Sialkot factory.
            </p>
          </div>
          <Link
            href='/quote'
            className='mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-md transition-all shrink-0'
          >
            <Send size={13} />
            <span>Request Quotation</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
