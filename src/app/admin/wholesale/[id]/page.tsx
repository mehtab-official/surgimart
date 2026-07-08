import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { Calendar, User, Mail, Building, MessageSquare, Phone, Activity } from 'lucide-react'
import { WholesaleStatusActions } from '@/components/admin/WholesaleStatusActions'

export default async function WholesaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const app = await prisma.wholesaleApplication.findUnique({
    where: { id }
  })

  if (!app) notFound()

  const categories = app.categories as string[]

  return (
    <div className='max-w-4xl space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-slate-800 italic'>Wholesale Application</h2>
          <div className='flex items-center gap-4 text-sm text-slate-500 mt-1'>
            <span className='flex items-center gap-1'><Calendar size={14}/> {new Date(app.createdAt).toLocaleString()}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              app.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
              app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>{app.status}</span>
          </div>
        </div>
        <WholesaleStatusActions appId={app.id} currentStatus={app.status} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='space-y-6'>
          {/* Organization Info */}
          <div className='bg-white p-6 rounded-2xl border border-slate-200 space-y-4'>
            <h3 className='font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2'>
              <Building size={18} className='text-blue-600' />
              Business Details
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-[10px] font-bold text-slate-400 uppercase'>Organization</p>
                <p className='text-sm font-bold text-slate-800'>{app.organization}</p>
              </div>
              <div>
                <p className='text-[10px] font-bold text-slate-400 uppercase'>Monthly Volume</p>
                <p className='text-sm font-bold text-blue-600'>{app.monthlyVolume}</p>
              </div>
              <div>
                <p className='text-[10px] font-bold text-slate-400 uppercase'>Country</p>
                <p className='text-sm font-medium'>{app.country}</p>
              </div>
            </div>
          </div>

          {/* Categories of Interest */}
          <div className='bg-white p-6 rounded-2xl border border-slate-200 space-y-4'>
            <h3 className='font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2'>
              <Activity size={18} className='text-teal-600' />
              Categories of Interest
            </h3>
            <div className='flex flex-wrap gap-2'>
              {categories.map(cat => (
                <span key={cat} className='px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold'>
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className='bg-white p-6 rounded-2xl border border-slate-200 space-y-4'>
            <h3 className='font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2'>
              <MessageSquare size={18} className='text-amber-500' />
              Application Message
            </h3>
            <p className='text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl italic'>
              "{app.message || 'No additional message provided.'}"
            </p>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Applicant Info */}
          <div className='bg-white p-6 rounded-2xl border border-slate-200 space-y-4'>
            <h3 className='font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2'>
              <User size={18} className='text-blue-600' />
              Applicant Info
            </h3>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-slate-100 rounded-lg text-slate-500'><User size={16}/></div>
                <div>
                  <p className='text-[10px] font-bold text-slate-400 uppercase'>Name</p>
                  <p className='text-sm font-medium'>{app.firstName} {app.lastName}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-slate-100 rounded-lg text-slate-500'><Mail size={16}/></div>
                <div>
                  <p className='text-[10px] font-bold text-slate-400 uppercase'>Email</p>
                  <p className='text-sm font-medium'>{app.email}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-slate-100 rounded-lg text-slate-500'><Phone size={16}/></div>
                <div>
                  <p className='text-[10px] font-bold text-slate-400 uppercase'>Phone</p>
                  <p className='text-sm font-medium'>{app.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
