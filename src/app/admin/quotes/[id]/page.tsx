import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { Calendar, User, Mail, Building, Globe, MessageSquare, Package } from 'lucide-react'
import { QuoteStatusButton } from '@/components/admin/QuoteStatusButton'

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quote = await prisma.quoteRequest.findUnique({
    where: { id }
  })

  if (!quote) notFound()

  return (
    <div className='max-w-4xl space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-slate-800 italic'>Quote Request Details</h2>
          <div className='flex items-center gap-4 text-sm text-slate-500 mt-1'>
            <span className='flex items-center gap-1'><Calendar size={14}/> {new Date(quote.createdAt).toLocaleString()}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              quote.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
            }`}>{quote.status}</span>
          </div>
        </div>
        <QuoteStatusButton quoteId={quote.id} currentStatus={quote.status} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='space-y-6'>
          <div className='bg-white p-6 rounded-2xl border border-slate-200 space-y-4'>
            <h3 className='font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2'>
              <Package size={18} className='text-blue-600' />
              Product Requested
            </h3>
            <div>
              <p className='text-sm text-slate-500'>Product Name</p>
              <p className='font-bold text-slate-800'>{quote.productName}</p>
            </div>
            <div>
              <p className='text-sm text-slate-500'>Quantity Requested</p>
              <p className='font-bold text-3xl text-blue-600'>{quote.qty}</p>
            </div>
          </div>

          <div className='bg-white p-6 rounded-2xl border border-slate-200 space-y-4'>
            <h3 className='font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2'>
              <MessageSquare size={18} className='text-amber-500' />
              Customer Message
            </h3>
            <p className='text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl italic'>
              "{quote.message || 'No additional message provided.'}"
            </p>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='bg-white p-6 rounded-2xl border border-slate-200 space-y-4'>
            <h3 className='font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2'>
              <User size={18} className='text-blue-600' />
              Customer Info
            </h3>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-slate-100 rounded-lg text-slate-500'><User size={16}/></div>
                <div>
                  <p className='text-[10px] font-bold text-slate-400 uppercase'>Name</p>
                  <p className='text-sm font-medium'>{quote.name}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-slate-100 rounded-lg text-slate-500'><Mail size={16}/></div>
                <div>
                  <p className='text-[10px] font-bold text-slate-400 uppercase'>Email</p>
                  <p className='text-sm font-medium'>{quote.email}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-slate-100 rounded-lg text-slate-500'><Building size={16}/></div>
                <div>
                  <p className='text-[10px] font-bold text-slate-400 uppercase'>Organization</p>
                  <p className='text-sm font-medium'>{quote.organization || 'Individual'}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-slate-100 rounded-lg text-slate-500'><Globe size={16}/></div>
                <div>
                  <p className='text-[10px] font-bold text-slate-400 uppercase'>Country</p>
                  <p className='text-sm font-medium'>{quote.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
