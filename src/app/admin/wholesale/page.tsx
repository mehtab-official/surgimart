import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { Search, Eye, Clock, CheckCircle2, XCircle } from 'lucide-react'

export default async function AdminWholesalePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const sp = await searchParams
  const query = sp.q || ''
  const page = parseInt(sp.page || '1')
  const limit = 10
  const skip = (page - 1) * limit

  const where = query ? {
    OR: [
      { firstName: { contains: query, mode: 'insensitive' as const } },
      { lastName: { contains: query, mode: 'insensitive' as const } },
      { organization: { contains: query, mode: 'insensitive' as const } },
      { email: { contains: query, mode: 'insensitive' as const } },
    ]
  } : {}

  const [apps] = await Promise.all([
    prisma.wholesaleApplication.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.wholesaleApplication.count({ where }),
  ])

  // const totalPages = Math.ceil(total / limit)

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-slate-800'>Wholesale Applications</h2>
        <p className='text-slate-500'>Review and manage distributor account applications.</p>
      </div>

      <div className='bg-white p-4 rounded-2xl border border-slate-200'>
        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
          <input 
            type='text' 
            placeholder='Search by Name, Org or Email...' 
            defaultValue={query}
            className='w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
          />
        </div>
      </div>

      <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='bg-slate-50 text-slate-500 font-medium'>
              <tr>
                <th className='px-6 py-4'>Organization</th>
                <th className='px-6 py-4'>Applicant</th>
                <th className='px-6 py-4'>Monthly Volume</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4'>Date</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {apps.map((app) => (
                <tr key={app.id} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4'>
                    <div className='min-w-0'>
                      <p className='font-bold text-slate-800 truncate'>{app.organization}</p>
                      <p className='text-[10px] text-slate-400 font-bold uppercase'>{app.country}</p>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <p className='font-medium'>{app.firstName} {app.lastName}</p>
                    <p className='text-xs text-slate-500'>{app.email}</p>
                  </td>
                  <td className='px-6 py-4 font-medium text-blue-600'>{app.monthlyVolume}</td>
                  <td className='px-6 py-4'>
                    <span className={`flex items-center gap-1.5 w-fit px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      app.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      app.status === 'approved' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {app.status === 'pending' ? <Clock size={10} /> : 
                       app.status === 'approved' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                      {app.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-slate-500'>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <Link 
                      href={`/admin/wholesale/${app.id}`}
                      className='p-2 text-slate-400 hover:text-blue-600 transition-colors inline-block'
                      title='Review Application'
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
