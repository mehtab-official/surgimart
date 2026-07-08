'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Menu, X, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete'
import { useCartStore, useWishlistStore, useCurrencyStore } from '@/store'
import { useHasMounted } from '@/hooks/useHasMounted'

const CURRENCIES = ["USD","AED","GBP","EUR","PKR","SAR","QAR"]
const CATEGORIES = ["Surgical","Dental","Orthopedic","Veterinary","ENT","Ophthalmology","Hospital"]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const hasMounted = useHasMounted()
  const cartCount = useCartStore(s => s.items.reduce((n,i) => n+i.qty, 0))
  const wishCount = useWishlistStore(s => s.items.length)
  const { currency, setCurrency } = useCurrencyStore()
  const openCart = useCartStore(s => s.openCart)
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-lg' : ''}`}>

      {/* ── Top bar: blue ── */}
      <div className='bg-blue-700'>
        <div className='max-w-7xl mx-auto px-4 py-3 flex items-center gap-4'>

          {/* Logo */}
          <Link href='/' data-testid='nav-logo' className='shrink-0'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/uploads/products/logo69.png' alt='Submed Ortho' className='h-14 w-auto object-contain' />
          </Link>

          {/* Search — white background so it stands out */}
          <div className='flex-1 max-w-xl hidden md:block'>
            <SearchAutocomplete />
          </div>

          {/* Currency */}
          <select value={currency} onChange={e => setCurrency(e.target.value)}
            aria-label='Select currency'
            data-testid='currency-switcher'
            className='text-sm border border-white/30 bg-white text-blue-700 font-semibold rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer'>
            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>

          {/* Icons */}
          <div className='flex items-center gap-3'>
            <Link href='/wishlist' className='relative text-white hover:text-blue-200 transition-colors' aria-label='Wishlist'>
              <Heart size={22} />
              {hasMounted && wishCount > 0 && (
                <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>{wishCount}</span>
              )}
            </Link>

            <button onClick={openCart} className='relative text-white hover:text-blue-200 transition-colors' data-testid='nav-cart-icon' aria-label='Cart'>
              <ShoppingCart size={22} />
              {hasMounted && cartCount > 0 && (
                <span data-testid='cart-badge' className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>{cartCount}</span>
              )}
            </button>

            {hasMounted && !isLoading && (
              session?.user ? (
                <div ref={userMenuRef} className='relative hidden md:block'>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className='flex items-center gap-2 bg-white text-blue-700 text-sm font-bold px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors'
                    data-testid='nav-user-avatar'
                  >
                    <User size={15} />
                    <span className='max-w-[90px] truncate'>{session.user.name || 'Account'}</span>
                    <ChevronDown size={13} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                        className='absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50'
                      >
                        <Link href='/account' onClick={() => setUserMenuOpen(false)}
                          className='flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50'>
                          <User size={14} /> My Account
                        </Link>
                        {session.user.role === 'admin' && (
                          <Link href='/admin' onClick={() => setUserMenuOpen(false)}
                            className='flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50'>
                            <LayoutDashboard size={14} /> Admin Panel
                          </Link>
                        )}
                        <hr className='my-1 border-slate-100' />
                        <button
                          onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                          className='flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left'
                          data-testid='signout-btn'
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href='/login' data-testid='nav-signin'
                  className='hidden md:block bg-white text-blue-700 text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors'>
                  Sign In
                </Link>
              )
            )}
            {hasMounted && isLoading && <div className='hidden md:block w-20 h-9 bg-blue-600 animate-pulse rounded-lg' />}

            <button onClick={() => setMobileOpen(!mobileOpen)} data-testid='hamburger' className='md:hidden text-white' aria-label='Toggle menu'>
              {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
            </button>
          </div>
        </div>
      </div>

      {/* ── Category strip: white with blue text ── */}
      <div className='bg-white border-b border-blue-100 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4'>
          <nav className='hidden md:flex items-center gap-1 py-1.5'>
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                href={`/shop?cat=${cat.toLowerCase()}`}
                className='text-xs font-semibold px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-700 hover:text-white transition-all whitespace-nowrap border border-transparent hover:border-blue-700'
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div data-testid='mobile-menu'
            initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
            className='md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-xl p-4 z-50'>
            {CATEGORIES.map(cat => (
              <Link key={cat} href={`/shop?cat=${cat.toLowerCase()}`}
                className='block py-2.5 text-sm font-semibold text-blue-700 border-b border-blue-50 hover:text-blue-900'>
                {cat}
              </Link>
            ))}
            {status === 'authenticated' ? (
              <>
                <Link href='/account' onClick={() => setMobileOpen(false)} className='block py-2.5 text-sm font-bold text-blue-700 border-b border-blue-50'>{session?.user?.name || 'My Account'}</Link>
                {session?.user?.role === 'admin' && (
                  <Link href='/admin' onClick={() => setMobileOpen(false)} className='block py-2.5 text-sm font-bold text-blue-700 border-b border-blue-50'>Admin Panel</Link>
                )}
                <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }) }} className='block py-2.5 text-sm font-bold text-red-600 w-full text-left'>Sign Out</button>
              </>
            ) : (
              <Link href='/login' className='block py-2.5 text-sm font-bold text-blue-700'>Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
