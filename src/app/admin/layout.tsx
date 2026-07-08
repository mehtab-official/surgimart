import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Users, 
  Mail, 
  Tags, 
  LogOut,
} from 'lucide-react'

const MENU_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Quote Requests', href: '/admin/quotes', icon: MessageSquare },
  { name: 'Wholesale Apps', href: '/admin/wholesale', icon: Users },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (session?.user?.role !== 'admin') {
    redirect('/login?callbackUrl=/admin')
  }

  return (
    <div className='flex min-h-screen bg-slate-50'>
      {/* Sidebar */}
      <aside className='w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen'>
        <div className='p-6 border-b border-slate-100'>
          <Link href='/' className='flex items-center gap-2'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/uploads/products/logo69.png' alt='Submed Ortho' className='h-16 w-auto object-contain' />
            <span className='bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded'>ADMIN</span>
          </Link>
        </div>
        
        <nav className='flex-1 p-4 space-y-1 overflow-y-auto'>
          {MENU_ITEMS.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className='flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors'
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className='p-4 border-t border-slate-100'>
          <Link 
            href='/api/auth/signout'
            className='flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors'
          >
            <LogOut size={20} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 flex flex-col min-w-0 overflow-hidden'>
        <header className='h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10'>
          <h1 className='font-lora text-lg font-bold text-slate-800'>Admin Panel</h1>
          <div className='flex items-center gap-4'>
            <div className='text-right hidden sm:block'>
              <p className='text-sm font-bold'>{session.user.name}</p>
              <p className='text-xs text-slate-500'>{session.user.email}</p>
            </div>
            <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold'>
              {session.user.name?.[0] || 'A'}
            </div>
          </div>
        </header>

        <div className='flex-1 overflow-y-auto p-8'>
          {children}
        </div>
      </main>
    </div>
  )
}
