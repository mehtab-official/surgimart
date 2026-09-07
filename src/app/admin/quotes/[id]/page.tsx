import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, Mail, Building, Globe, MessageSquare, Package, ArrowLeft } from 'lucide-react'
import { QuoteStatusButton } from '@/components/admin/QuoteStatusButton'

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let quote: any = null
  try {
    quote = await prisma.quoteRequest.findUnique({
      where: { id }
    })
  } catch (err) {
    console.warn('DB error fetching quote detail:', err)
  }

  if (!quote) {
    return (
      <div className='max-w-2xl mx-auto py-12 text-center'>
        <div className='p-8 rounded-2xl bg-[#0a1426] border border-slate-800 text-slate-300'>
          <MessageSquare size={36} className='mx-auto mb-3 text-amber-400 opacity-60' />
          <h3 className='text-lg font-bold text-white mb-1'>Quote Request Not Found</h3>
          <p className='text-xs text-slate-400 mb-6'>The requested RFQ record could not be loaded from the database.</p>
          <Link href='/admin/quotes' className='inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700'>
            <ArrowLeft size={14} /> Back to Quote Requests
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-4xl space-y-6'>
      <Link href='/admin/quotes' className='inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors'>
        <ArrowLeft size={14} /> Back to Quotes List
      </Link>

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-white tracking-tight'>Quote Request Details</h2>
          <div className='flex items-center gap-4 text-xs text-slate-400 mt-1'>
            <span className='flex items-center gap-1.5'><Calendar size={13}/> {new Date(quote.createdAt).toLocaleString()}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
              quote.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}>{quote.status}</span>
          </div>
        </div>
        <QuoteStatusButton quoteId={quote.id} currentStatus={quote.status} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-6'>
          <div className='bg-[#0a1426] p-6 rounded-2xl border border-slate-800/80 space-y-4 shadow-md'>
            <h3 className='font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2 text-sm'>
              <Package size={17} className='text-amber-400' />
              Instrument Requested
            </h3>
            <div>
              <p className='text-xs text-slate-400'>Product / Instrument</p>
              <p className='font-bold text-white text-base mt-0.5'>{quote.productName}</p>
            </div>
            <div>
              <p className='text-xs text-slate-400'>Requested Volume</p>
              <p className='font-bold text-3xl text-amber-400 font-mono mt-0.5'>{quote.qty} <span className='text-sm text-slate-400 font-sans font-normal'>units</span></p>
            </div>
          </div>

          <div className='bg-[#0a1426] p-6 rounded-2xl border border-slate-800/80 space-y-3 shadow-md'>
            <h3 className='font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2 text-sm'>
              <MessageSquare size={17} className='text-sky-400' />
              Buyer Inquiry Message
            </h3>
            <p className='text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800 italic'>
              &quot;{quote.message || 'No additional message provided.'}&quot;
            </p>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='bg-[#0a1426] p-6 rounded-2xl border border-slate-800/80 space-y-4 shadow-md'>
            <h3 className='font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2 text-sm'>
              <User size={17} className='text-emerald-400' />
              Buyer Contact Information
            </h3>
            <div className='space-y-4 text-xs'>
              <div className='flex items-center gap-3'>
                <div className='p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400'><User size={15}/></div>
                <div>
                  <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>Buyer Name</p>
                  <p className='font-medium text-white text-sm'>{quote.name}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400'><Mail size={15}/></div>
                <div>
                  <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>Email</p>
                  <a href={`mailto:${quote.email}`} className='font-medium text-sky-400 hover:underline text-sm'>{quote.email}</a>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400'><Building size={15}/></div>
                <div>
                  <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>Organization / Hospital</p>
                  <p className='font-medium text-slate-200 text-sm'>{quote.organization || 'Independent Practice'}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400'><Globe size={15}/></div>
                <div>
                  <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>Destination Country</p>
                  <p className='font-medium text-slate-200 text-sm'>{quote.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
