import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Industry insights, product guides, and company updates from Submed Ortho.',
}

export default function BlogPage() {
  return (
    <section className='max-w-7xl mx-auto px-4 py-16'>
      <h1 className='font-lora text-3xl font-bold text-center mb-3'>Blog</h1>
      <p className='text-center text-slate-500 mb-12'>Industry insights, product guides, and company updates</p>
      <div className='text-center py-20'>
        <p className='text-slate-500 text-lg'>Blog posts will appear here once Sanity CMS is configured.</p>
      </div>
    </section>
  )
}
