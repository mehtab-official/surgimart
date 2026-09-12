'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Phone, 
  Mail, 
  MapPin,
  Search, 
  ChevronDown, 
  Menu, 
  X, 
  FileText, 
  Globe, 
  Award, 
  Briefcase, 
  HelpCircle, 
  Calendar, 
  BookOpen, 
  Truck, 
  Send,
  User,
  LogOut,
  LayoutDashboard,
  ShoppingCart,
  Download,
  Instagram
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete'
import { useCartStore, useCurrencyStore } from '@/store'
import { useHasMounted } from '@/hooks/useHasMounted'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [insightsOpen, setInsightsOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const companyRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)
  const insightsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const hasMounted = useHasMounted()
  const cartCount = useCartStore(s => s.items.reduce((n, i) => n + i.qty, 0))
  const openCart = useCartStore(s => s.openCart)
  const { currency, setCurrency } = useCurrencyStore()
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  const pathname = usePathname()
  const isHomeActive = pathname === '/'
  const isCompanyActive = ['/about', '/career', '/certificates'].some(p => pathname?.startsWith(p))
  const isProductsActive = pathname?.startsWith('/shop')
  const isSupplyChainActive = pathname?.startsWith('/supply-chain')
  const isInsightsActive = ['/catalogue', '/events', '/blog', '/faq'].some(p => pathname?.startsWith(p))
  const isContactActive = pathname?.startsWith('/contact')
  const isQuoteActive = pathname?.startsWith('/quote')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) {
        setCompanyOpen(false)
      }
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) {
        setProductsOpen(false)
      }
      if (insightsRef.current && !insightsRef.current.contains(e.target as Node)) {
        setInsightsOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'shadow-md' : ''}`}>

      {/* ── MAIN HEADER (Logo, Primary Nav, Search, RFQ Action) ── */}
      <div className='bg-white border-b border-slate-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 lg:gap-6'>
          
          {/* Logo */}
          <Link href='/' data-testid='nav-logo' className='shrink-0 flex items-center gap-2.5 group'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src='/uploads/products/logo69.png' 
              alt='SubMedOrtho' 
              className='h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-sm' 
            />
            <div>
              <span className='block text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none'>
                SubMed<span className='text-blue-600'>Ortho</span>
              </span>
              <span className='block text-[10px] font-bold tracking-wider text-slate-500 uppercase mt-1'>
                Surgical & Orthopedic Export
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAVIGATION ── */}
          <nav className='hidden lg:flex items-center justify-center gap-0.5 xl:gap-1.5 flex-1'>
            
            {/* Home */}
            <Link 
              href='/' 
              className={`text-[14px] xl:text-[15px] tracking-tight px-3 xl:px-4 py-2 rounded-xl transition-all relative ${
                isHomeActive 
                  ? 'text-blue-700 bg-blue-50/90 font-extrabold shadow-sm border border-blue-200/80 ring-1 ring-blue-500/20' 
                  : 'text-slate-800 hover:text-blue-700 hover:bg-slate-100/80 font-bold'
              }`}
            >
              Home
              {isHomeActive && (
                <span className='absolute bottom-1 left-3 right-3 h-0.5 bg-blue-600 rounded-full' />
              )}
            </Link>

            {/* Company Dropdown */}
            <div 
              ref={companyRef} 
              className='relative'
              onMouseEnter={() => setCompanyOpen(true)}
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <button
                onClick={() => setCompanyOpen(v => !v)}
                className={`flex items-center gap-1 text-[14px] xl:text-[15px] tracking-tight px-3 xl:px-4 py-2 rounded-xl transition-all relative ${
                  isCompanyActive 
                    ? 'text-blue-700 bg-blue-50/90 font-extrabold shadow-sm border border-blue-200/80 ring-1 ring-blue-500/20' 
                    : 'text-slate-800 hover:text-blue-700 hover:bg-slate-100/80 font-bold'
                }`}
              >
                <span>Company</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${companyOpen ? 'rotate-180' : ''}`} />
                {isCompanyActive && (
                  <span className='absolute bottom-1 left-3 right-3 h-0.5 bg-blue-600 rounded-full' />
                )}
              </button>

              <AnimatePresence>
                {companyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className='absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50'
                  >
                    <Link 
                      href='/about' 
                      onClick={() => setCompanyOpen(false)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                        pathname === '/about' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-800 font-medium'
                      }`}
                    >
                      <Globe size={18} className='text-blue-600 mt-0.5 shrink-0' />
                      <div>
                        <div className='text-sm font-bold text-slate-900'>About Us</div>
                        <div className='text-xs text-slate-500'>15+ Years experience, history & mission</div>
                      </div>
                    </Link>

                    <Link 
                      href='/career' 
                      onClick={() => setCompanyOpen(false)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                        pathname === '/career' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-800 font-medium'
                      }`}
                    >
                      <Briefcase size={18} className='text-blue-600 mt-0.5 shrink-0' />
                      <div>
                        <div className='text-sm font-bold text-slate-900'>Career</div>
                        <div className='text-xs text-slate-500'>Join our manufacturing craftsmanship team</div>
                      </div>
                    </Link>

                    <Link 
                      href='/certificates' 
                      onClick={() => setCompanyOpen(false)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                        pathname === '/certificates' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-800 font-medium'
                      }`}
                    >
                      <Award size={18} className='text-blue-600 mt-0.5 shrink-0' />
                      <div>
                        <div className='text-sm font-bold text-slate-900'>Global Recognition</div>
                        <div className='text-xs text-slate-500'>ISO 9001:2015 & ISO 13485:2016 standards</div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Products Mega Dropdown */}
            <div 
              ref={productsRef} 
              className='relative'
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                onClick={() => setProductsOpen(v => !v)}
                className={`flex items-center gap-1 text-[14px] xl:text-[15px] tracking-tight px-3 xl:px-4 py-2 rounded-xl transition-all relative ${
                  isProductsActive 
                    ? 'text-blue-700 bg-blue-50/90 font-extrabold shadow-sm border border-blue-200/80 ring-1 ring-blue-500/20' 
                    : 'text-slate-800 hover:text-blue-700 hover:bg-slate-100/80 font-bold'
                }`}
              >
                <span>Products</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
                {isProductsActive && (
                  <span className='absolute bottom-1 left-3 right-3 h-0.5 bg-blue-600 rounded-full' />
                )}
              </button>

              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className='absolute top-full -left-20 mt-1 w-[620px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-50'
                  >
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-1.5'>
                        <div className='text-xs font-bold uppercase tracking-wider text-blue-600 px-2.5 py-1'>
                          Primary Specialities
                        </div>
                        <Link 
                          href='/shop?cat=general-surgery'
                          onClick={() => setProductsOpen(false)}
                          className='block px-2.5 py-2 rounded-lg hover:bg-blue-50/60 transition-colors'
                        >
                          <div className='text-sm font-bold text-slate-800'>General Surgery</div>
                          <div className='text-xs text-slate-500'>Forceps, Clamps, Scissors, Retractors, Holders</div>
                        </Link>
                        <Link 
                          href='/shop?cat=orthopaedic'
                          onClick={() => setProductsOpen(false)}
                          className='block px-2.5 py-2 rounded-lg hover:bg-blue-50/60 transition-colors'
                        >
                          <div className='text-sm font-bold text-slate-800'>Orthopaedic</div>
                          <div className='text-xs text-slate-500'>Bone Rongeurs, Spreaders, Curettes, Mallets, Wires</div>
                        </Link>
                        <Link 
                          href='/shop?cat=ent'
                          onClick={() => setProductsOpen(false)}
                          className='block px-2.5 py-2 rounded-lg hover:bg-blue-50/60 transition-colors'
                        >
                          <div className='text-sm font-bold text-slate-800'>ENT Instruments</div>
                          <div className='text-xs text-slate-500'>Ear Picks, Suction Tubes, Aural & Tonsil Forceps</div>
                        </Link>
                      </div>

                      <div className='space-y-1.5 border-l border-slate-100 pl-4'>
                        <div className='text-xs font-bold uppercase tracking-wider text-blue-600 px-2.5 py-1'>
                          Specialized Systems
                        </div>
                        <Link 
                          href='/shop?cat=neuro-spinal'
                          onClick={() => setProductsOpen(false)}
                          className='block px-2.5 py-2 rounded-lg hover:bg-blue-50/60 transition-colors'
                        >
                          <div className='text-sm font-bold text-slate-800'>Neuro / Spinal Surgery</div>
                          <div className='text-xs text-slate-500'>Micro Forceps, Elevators, Dissectors, Curettes</div>
                        </Link>
                        <Link 
                          href='/shop?cat=implants'
                          onClick={() => setProductsOpen(false)}
                          className='block px-2.5 py-2 rounded-lg hover:bg-blue-50/60 transition-colors'
                        >
                          <div className='text-sm font-bold text-slate-800'>Implants & Plates</div>
                          <div className='text-xs text-slate-500'>Locking Radius Plates, DHS-DCS, Bone Screws</div>
                        </Link>
                        <div className='pt-2'>
                          <Link
                            href='/catalogue'
                            onClick={() => setProductsOpen(false)}
                            className='flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors'
                          >
                            <span>Download Full PDF Catalogue</span>
                            <Download size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Supply Chain */}
            <Link 
              href='/supply-chain' 
              className={`text-[14px] xl:text-[15px] tracking-tight px-3 xl:px-4 py-2 rounded-xl transition-all relative ${
                isSupplyChainActive 
                  ? 'text-blue-700 bg-blue-50/90 font-extrabold shadow-sm border border-blue-200/80 ring-1 ring-blue-500/20' 
                  : 'text-slate-800 hover:text-blue-700 hover:bg-slate-100/80 font-bold'
              }`}
            >
              Supply Chain
              {isSupplyChainActive && (
                <span className='absolute bottom-1 left-3 right-3 h-0.5 bg-blue-600 rounded-full' />
              )}
            </Link>

            {/* Insights Dropdown */}
            <div 
              ref={insightsRef} 
              className='relative'
              onMouseEnter={() => setInsightsOpen(true)}
              onMouseLeave={() => setInsightsOpen(false)}
            >
              <button
                onClick={() => setInsightsOpen(v => !v)}
                className={`flex items-center gap-1 text-[14px] xl:text-[15px] tracking-tight px-3 xl:px-4 py-2 rounded-xl transition-all relative ${
                  isInsightsActive 
                    ? 'text-blue-700 bg-blue-50/90 font-extrabold shadow-sm border border-blue-200/80 ring-1 ring-blue-500/20' 
                    : 'text-slate-800 hover:text-blue-700 hover:bg-slate-100/80 font-bold'
                }`}
              >
                <span>Insights</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${insightsOpen ? 'rotate-180' : ''}`} />
                {isInsightsActive && (
                  <span className='absolute bottom-1 left-3 right-3 h-0.5 bg-blue-600 rounded-full' />
                )}
              </button>

              <AnimatePresence>
                {insightsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className='absolute top-full left-0 mt-1 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50'
                  >
                    <Link 
                      href='/catalogue' 
                      onClick={() => setInsightsOpen(false)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-colors ${
                        pathname === '/catalogue' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-800 font-medium'
                      }`}
                    >
                      <FileText size={16} className='text-blue-600 mt-0.5 shrink-0' />
                      <div>
                        <div className='text-sm font-bold text-slate-900'>Resources & PDFs</div>
                        <div className='text-xs text-slate-500'>Instrument catalogs & specs</div>
                      </div>
                    </Link>

                    <Link 
                      href='/events' 
                      onClick={() => setInsightsOpen(false)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-colors ${
                        pathname === '/events' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-800 font-medium'
                      }`}
                    >
                      <Calendar size={16} className='text-blue-600 mt-0.5 shrink-0' />
                      <div>
                        <div className='text-sm font-bold text-slate-900'>Expo & Events</div>
                        <div className='text-xs text-slate-500'>Medical exhibitions & trade fairs</div>
                      </div>
                    </Link>

                    <Link 
                      href='/blog' 
                      onClick={() => setInsightsOpen(false)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-colors ${
                        pathname === '/blog' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-800 font-medium'
                      }`}
                    >
                      <BookOpen size={16} className='text-blue-600 mt-0.5 shrink-0' />
                      <div>
                        <div className='text-sm font-bold text-slate-900'>Blogs</div>
                        <div className='text-xs text-slate-500'>Surgical manufacturing updates</div>
                      </div>
                    </Link>

                    <Link 
                      href='/faq' 
                      onClick={() => setInsightsOpen(false)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-colors ${
                        pathname === '/faq' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-800 font-medium'
                      }`}
                    >
                      <HelpCircle size={16} className='text-blue-600 mt-0.5 shrink-0' />
                      <div>
                        <div className='text-sm font-bold text-slate-900'>FAQs</div>
                        <div className='text-xs text-slate-500'>Shipping, quality & compliance</div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Us */}
            <Link 
              href='/contact' 
              className={`text-[14px] xl:text-[15px] tracking-tight px-3 xl:px-4 py-2 rounded-xl transition-all relative ${
                isContactActive 
                  ? 'text-blue-700 bg-blue-50/90 font-extrabold shadow-sm border border-blue-200/80 ring-1 ring-blue-500/20' 
                  : 'text-slate-800 hover:text-blue-700 hover:bg-slate-100/80 font-bold'
              }`}
            >
              Contact Us
              {isContactActive && (
                <span className='absolute bottom-1 left-3 right-3 h-0.5 bg-blue-600 rounded-full' />
              )}
            </Link>
          </nav>

          {/* ── RIGHT ACTION AREA (Search Modal, Admin/Sign In, Request Quote CTA) ── */}
          <div className='flex items-center gap-2.5 sm:gap-3'>
            
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className='p-2.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors'
              aria-label='Search products'
            >
              <Search size={20} />
            </button>

            {/* Direct RFQ Inquire Quick Link */}
            <Link 
              href='/quote'
              className={`p-2.5 rounded-full transition-colors ${
                isQuoteActive 
                  ? 'text-blue-600 bg-blue-50 ring-2 ring-blue-600/30' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
              }`} 
              data-testid='nav-cart-icon' 
              title='Request a Quotation (RFQ)'
              aria-label='Request Quotation'
            >
              <FileText size={20} />
            </Link>

            {/* Account / Admin / Sign In */}
            {hasMounted && !isLoading && (
              session?.user ? (
                <div ref={userMenuRef} className='relative'>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className='flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200/80 transition-colors shadow-sm'
                    data-testid='nav-user-avatar'
                  >
                    <User size={15} className='text-blue-600' />
                    <span className='max-w-[90px] truncate hidden md:inline'>{session.user.name || 'Account'}</span>
                    <ChevronDown size={13} className={`transition-transform text-slate-500 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className='absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200/80 py-2 z-50 text-slate-800 text-xs divide-y divide-slate-100'
                      >
                        <div className='px-4 py-2 bg-slate-50/70'>
                          <p className='text-[11px] text-slate-400 font-semibold uppercase tracking-wider'>Signed in as</p>
                          <p className='text-xs font-bold text-slate-900 truncate'>{session.user.name || session.user.email}</p>
                          {session.user.role === 'admin' && (
                            <span className='inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700'>
                              Admin
                            </span>
                          )}
                        </div>
                        <div className='py-1'>
                          <Link 
                            href='/account' 
                            onClick={() => setUserMenuOpen(false)}
                            className='flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold transition-colors'
                          >
                            <User size={15} className='text-slate-500' /> My Account
                          </Link>
                          {session.user.role === 'admin' && (
                            <Link 
                              href='/admin' 
                              onClick={() => setUserMenuOpen(false)}
                              className='flex items-center gap-2.5 px-4 py-2 hover:bg-blue-50/80 text-blue-600 font-bold transition-colors'
                            >
                              <LayoutDashboard size={15} /> Admin Panel
                            </Link>
                          )}
                        </div>
                        <div className='py-1'>
                          <button
                            onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                            className='flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left font-semibold transition-colors'
                            data-testid='signout-btn'
                          >
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  href='/login' 
                  data-testid='nav-signin' 
                  className='flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200/80 transition-colors shadow-sm'
                >
                  <User size={14} className='text-blue-600' />
                  <span>Sign In</span>
                </Link>
              )
            )}

            {/* Primary Request a Quote Button */}
            <Link 
              href='/quote'
              className={`hidden sm:inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all ${
                isQuoteActive 
                  ? 'bg-blue-700 text-white ring-2 ring-blue-400 ring-offset-2' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Send size={13} />
              <span>Request a Quote</span>
            </Link>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)} 
              data-testid='hamburger' 
              className='lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg' 
              aria-label='Toggle menu'
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── SEARCH MODAL OVERLAY ── */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4'>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className='w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 relative border border-slate-100'
            >
              <div className='flex items-center justify-between pb-4 border-b border-slate-100'>
                <div>
                  <h3 className='font-bold text-slate-900 text-base'>Search Medical & Surgical Catalog</h3>
                  <p className='text-xs text-slate-500'>Find instruments by name, category, or SKU</p>
                </div>
                <button 
                  onClick={() => setSearchModalOpen(false)}
                  className='p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg'
                >
                  <X size={18} />
                </button>
              </div>

              <div className='mt-4'>
                <SearchAutocomplete />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MOBILE MENU DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            data-testid='mobile-menu'
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className='lg:hidden bg-white border-b border-slate-200 shadow-xl overflow-hidden'
          >
            <div className='p-4 space-y-3 max-h-[80vh] overflow-y-auto'>
              
              {/* Phone and Email in Mobile */}
              <div className='p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-600 border border-slate-100'>
                <div className='flex items-center gap-2 font-semibold text-slate-900'>
                  <Phone size={14} className='text-blue-600' />
                  <span>+92 340-6218274</span>
                </div>
                <div className='flex items-center gap-2 text-slate-700 font-medium'>
                  <Mail size={14} className='text-blue-600' />
                  <span>sales@submedortho.com</span>
                </div>
                <div className='flex items-center gap-4 pt-1.5 border-t border-slate-200/60'>
                  <a 
                    href='https://pk.linkedin.com/in/submed-ortho-47439a425' 
                    target='_blank' 
                    rel='noopener noreferrer' 
                    className='flex items-center gap-1.5 text-sky-700 font-semibold text-xs'
                  >
                    <div className='w-5 h-5 rounded-full bg-[#0A66C2] flex items-center justify-center text-white'>
                      <svg className='w-2.5 h-2.5 fill-current' viewBox='0 0 24 24'>
                        <path d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z' />
                      </svg>
                    </div>
                    <span>LinkedIn</span>
                  </a>
                  <a 
                    href='https://www.instagram.com/submedortho' 
                    target='_blank' 
                    rel='noopener noreferrer' 
                    className='flex items-center gap-1.5 text-rose-600 font-semibold text-xs'
                  >
                    <Instagram size={14} />
                    <span>@submedortho</span>
                  </a>
                </div>
                <div className='flex items-center gap-2 text-slate-500 text-[11px] pt-1 border-t border-slate-200/60'>
                  <MapPin size={13} className='text-rose-500' />
                  <span>Sialkot, Pakistan (Surgical Export Hub)</span>
                </div>
              </div>

              <div className='space-y-1 text-sm font-semibold text-slate-800'>
                <Link 
                  href='/' 
                  onClick={() => setMobileOpen(false)} 
                  className={`block py-2 px-3 rounded-lg transition-colors ${
                    isHomeActive ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  Home
                </Link>
                
                <div className='py-2 px-3 font-bold text-xs uppercase tracking-wider text-blue-600'>Company</div>
                <Link 
                  href='/about' 
                  onClick={() => setMobileOpen(false)} 
                  className={`block py-1.5 px-6 text-sm rounded-lg transition-colors ${
                    pathname === '/about' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  About Us
                </Link>
                <Link 
                  href='/career' 
                  onClick={() => setMobileOpen(false)} 
                  className={`block py-1.5 px-6 text-sm rounded-lg transition-colors ${
                    pathname === '/career' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  Career
                </Link>
                <Link 
                  href='/certificates' 
                  onClick={() => setMobileOpen(false)} 
                  className={`block py-1.5 px-6 text-sm rounded-lg transition-colors ${
                    pathname === '/certificates' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  Global Recognition
                </Link>

                <div className='py-2 px-3 font-bold text-xs uppercase tracking-wider text-blue-600'>Products</div>
                <Link 
                  href='/shop?cat=general-surgery' 
                  onClick={() => setMobileOpen(false)} 
                  className='block py-1.5 px-6 text-sm text-slate-600 hover:text-blue-600'
                >
                  General Surgery
                </Link>
                <Link 
                  href='/shop?cat=orthopaedic' 
                  onClick={() => setMobileOpen(false)} 
                  className='block py-1.5 px-6 text-sm text-slate-600 hover:text-blue-600'
                >
                  Orthopaedic
                </Link>
                <Link 
                  href='/shop?cat=ent' 
                  onClick={() => setMobileOpen(false)} 
                  className='block py-1.5 px-6 text-sm text-slate-600 hover:text-blue-600'
                >
                  ENT Instruments
                </Link>
                <Link 
                  href='/shop?cat=neuro-spinal' 
                  onClick={() => setMobileOpen(false)} 
                  className='block py-1.5 px-6 text-sm text-slate-600 hover:text-blue-600'
                >
                  Neuro / Spinal
                </Link>
                <Link 
                  href='/shop?cat=implants' 
                  onClick={() => setMobileOpen(false)} 
                  className='block py-1.5 px-6 text-sm text-slate-600 hover:text-blue-600'
                >
                  Implants & Plates
                </Link>
                
                <div className='py-2 px-3 font-bold text-xs uppercase tracking-wider text-blue-600'>Insights</div>
                <Link 
                  href='/catalogue' 
                  onClick={() => setMobileOpen(false)} 
                  className={`block py-1.5 px-6 text-sm rounded-lg transition-colors ${
                    pathname === '/catalogue' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  Catalogue PDF
                </Link>
                <Link 
                  href='/events' 
                  onClick={() => setMobileOpen(false)} 
                  className={`block py-1.5 px-6 text-sm rounded-lg transition-colors ${
                    pathname === '/events' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  Expo & Events
                </Link>
                <Link 
                  href='/blog' 
                  onClick={() => setMobileOpen(false)} 
                  className={`block py-1.5 px-6 text-sm rounded-lg transition-colors ${
                    pathname === '/blog' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  Blogs
                </Link>
                <Link 
                  href='/faq' 
                  onClick={() => setMobileOpen(false)} 
                  className={`block py-1.5 px-6 text-sm rounded-lg transition-colors ${
                    pathname === '/faq' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  FAQs
                </Link>

                <Link 
                  href='/supply-chain' 
                  onClick={() => setMobileOpen(false)} 
                  className={`block py-2 px-3 rounded-lg transition-colors ${
                    isSupplyChainActive ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  Supply Chain
                </Link>
                <Link 
                  href='/contact' 
                  onClick={() => setMobileOpen(false)} 
                  className={`block py-2 px-3 rounded-lg transition-colors ${
                    isContactActive ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  Contact Us
                </Link>
              </div>

              {/* Mobile Account / Sign In */}
              <div className='pt-2 border-t border-slate-100'>
                {hasMounted && !isLoading && (
                  session?.user ? (
                    <div className='bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <div className='w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs'>
                            {session.user.name ? session.user.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className='text-xs font-bold text-slate-900'>{session.user.name || 'User Account'}</p>
                            <p className='text-[10px] text-slate-500 truncate max-w-[150px]'>{session.user.email}</p>
                          </div>
                        </div>
                        {session.user.role === 'admin' && (
                          <span className='px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white'>
                            Admin
                          </span>
                        )}
                      </div>
                      <div className='grid grid-cols-2 gap-2 pt-1'>
                        <Link
                          href='/account'
                          onClick={() => setMobileOpen(false)}
                          className='flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm'
                        >
                          <User size={13} />
                          <span>My Account</span>
                        </Link>
                        {session.user.role === 'admin' && (
                          <Link
                            href='/admin'
                            onClick={() => setMobileOpen(false)}
                            className='flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 shadow-sm'
                          >
                            <LayoutDashboard size={13} />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                      </div>
                      <button
                        onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }) }}
                        className='w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors'
                      >
                        <LogOut size={13} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      href='/login'
                      onClick={() => setMobileOpen(false)}
                      className='flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl border border-slate-200/80 transition-colors mb-2'
                    >
                      <User size={14} className='text-blue-600' />
                      <span>Sign In / Admin Login</span>
                    </Link>
                  )
                )}
              </div>

              <div className='pt-2 border-t border-slate-100'>
                <Link 
                  href='/quote'
                  onClick={() => setMobileOpen(false)}
                  className='flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold text-sm py-3 rounded-xl shadow'
                >
                  <Send size={15} />
                  <span>Request a Quote (RFQ)</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

