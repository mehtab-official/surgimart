import Link from 'next/link'

const LINKS = {
  Shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?badge=NEW' },
    { label: 'Best Sellers', href: '/shop?sort=popular' },
    { label: 'Wholesale', href: '/wholesale' },
  ],
  Support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Shipping Info', href: '/faq#shipping' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
}

export function Footer() {
  return (
    <footer className='bg-slate-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 py-16'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
          <div>
            <div className='mb-4'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src='/uploads/products/logo69.png' alt='Submed Ortho' className='h-24 w-24 object-contain' />
            </div>
            <p className='text-slate-400 text-sm leading-relaxed'>
              Premium surgical instruments trusted by 200K+ medical professionals worldwide.
            </p>
            <div className='flex gap-3 mt-4'>
              <a href='https://wa.me/923273961505' target='_blank' rel='noopener noreferrer'
                className='bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-green-700'>
                WhatsApp
              </a>
              <a href='https://www.instagram.com/submedortho?igsh=ODhxd3MxYjI5aDRu' target='_blank' rel='noopener noreferrer'
                className='bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-xs font-bold px-4 py-2 rounded-full hover:opacity-90'>
                Instagram
              </a>
            </div>
          </div>
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className='font-bold text-sm uppercase tracking-wider text-slate-400 mb-4'>{title}</h4>
              <ul className='space-y-2'>
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className='text-sm text-slate-300 hover:text-blue-400'>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className='border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500'>
          <p>&copy; {new Date().getFullYear()} Submed Ortho. All rights reserved.</p>
          <p>000, P.O Khas, Langriali, Sialkot, Pakistan</p>
        </div>
      </div>
    </footer>
  )
}
