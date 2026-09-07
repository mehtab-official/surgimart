import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { AdminSidebarNav } from '@/components/admin/AdminSidebarNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (session?.user?.role !== 'admin') {
    redirect('/login?callbackUrl=/admin')
  }

  return (
    <div data-admin-theme='dark' className='flex min-h-screen bg-[#070e1e] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950'>
      {/* Sidebar */}
      <aside className='w-64 bg-[#0a1426] border-r border-slate-800/80 hidden md:flex flex-col sticky top-0 h-screen shadow-2xl z-20'>
        {/* Brand Header */}
        <div className='p-6 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/50 to-transparent'>
          <Link href='/' className='flex items-center gap-3 group'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/uploads/products/logo69.png' alt='SubMedOrtho' className='h-12 w-auto object-contain drop-shadow' />
            <div>
              <div className='flex items-center gap-1.5'>
                <span className='font-bold text-sm tracking-wide text-white group-hover:text-amber-400 transition-colors'>SubMedOrtho</span>
                <span className='bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider'>B2B ADMIN</span>
              </div>
              <p className='text-[10px] text-slate-400 font-medium tracking-tight'>Showcase & RFQ Control</p>
            </div>
          </Link>
        </div>
        
        {/* Navigation with Active Tab Highlighting */}
        <AdminSidebarNav />

        {/* User / Sign Out Footer */}
        <div className='p-4 border-t border-slate-800/80 bg-[#08101f]'>
          <div className='flex items-center gap-3 mb-3 px-2'>
            <div className='w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md'>
              {session.user.name?.[0] || 'A'}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-xs font-bold text-white truncate'>{session.user.name}</p>
              <p className='text-[10px] text-slate-400 truncate'>{session.user.email}</p>
            </div>
          </div>
          <Link 
            href='/api/auth/signout'
            className='flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-bold text-red-400 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 rounded-lg transition-colors'
          >
            <LogOut size={14} />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Shell */}
      <main className='flex-1 flex flex-col min-w-0 overflow-hidden bg-[#070e1e]'>
        <header className='h-16 bg-[#0a1426]/90 backdrop-blur border-b border-slate-800/80 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-10'>
          <div className='flex items-center gap-3'>
            <h1 className='text-base font-bold text-white tracking-tight flex items-center gap-2'>
              <ShieldCheck size={18} className='text-amber-400' />
              SubMedOrtho Admin Portal
            </h1>
            <span className='hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700'>
              Showcase Platform
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Link 
              href='/catalogue' 
              target='_blank' 
              className='text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg transition-colors'
            >
              View Catalogues
            </Link>
            <Link 
              href='/quote' 
              target='_blank' 
              className='text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors'
            >
              Public RFQ Desk
            </Link>
          </div>
        </header>

        <div className='flex-1 overflow-y-auto p-6 lg:p-8 bg-[#070e1e]'>
          {children}
        </div>
      </main>
    </div>
  )
}
