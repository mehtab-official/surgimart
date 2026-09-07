'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  Tags, 
  ExternalLink,
  Download,
  Video,
  Film
} from 'lucide-react'

const MENU_ITEMS = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Showcase Products', href: '/admin/products', icon: Package },
  { name: 'Hero Video & Showcase', href: '/admin/showcase', icon: Film },
  { name: 'Featured Products & Video', href: '/admin/featured', icon: Video },
  { name: 'Quote Requests (RFQ)', href: '/admin/quotes', icon: MessageSquare },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
]

export function AdminSidebarNav() {
  const pathname = usePathname()

  return (
    <nav className='flex-1 p-4 space-y-1.5 overflow-y-auto'>
      <p className='px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400'>
        Management
      </p>
      
      {MENU_ITEMS.map((item) => {
        const isActive = item.href === '/admin' 
          ? pathname === '/admin' 
          : pathname?.startsWith(item.href)

        return (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all border ${
              isActive 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm font-bold' 
                : 'text-slate-300 border-transparent hover:bg-slate-800/70 hover:text-amber-400 hover:border-slate-700/50'
            }`}
          >
            <item.icon 
              size={18} 
              className={isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-400'} 
            />
            <span>{item.name}</span>
            {isActive && (
              <span className='ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' />
            )}
          </Link>
        )
      })}

      <div className='pt-6'>
        <p className='px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400'>
          Public Portal
        </p>
        <Link 
          href='/'
          target='_blank'
          className='flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800/40 transition-colors'
        >
          <span className='flex items-center gap-2'>
            <ExternalLink size={15} />
            Live Showcase Website
          </span>
        </Link>
        <Link 
          href='/catalogue'
          target='_blank'
          className='flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800/40 transition-colors'
        >
          <span className='flex items-center gap-2'>
            <Download size={15} />
            Download Catalogues
          </span>
        </Link>
      </div>
    </nav>
  )
}
