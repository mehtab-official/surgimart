import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className='text-center space-y-6 p-8'>
        <h1 className='font-lora text-6xl font-bold text-slate-900'>404</h1>
        <h2 className='text-xl font-semibold text-slate-700'>Page Not Found</h2>
        <p className='text-slate-500 max-w-md'>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className='flex gap-3 justify-center'>
          <Link href='/'
            className='bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700'>
            Go Home
          </Link>
          <Link href='/shop'
            className='border-2 border-blue-600 text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50'>
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
