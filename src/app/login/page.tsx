'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) { toast.error('Invalid email or password') }
    else { window.location.href = '/account' }
    setLoading(false)
  }

  return (
    <section className='max-w-md mx-auto px-4 py-16'>
      <h1 className='font-lora text-3xl font-bold text-center mb-8'>Sign In</h1>
      <button onClick={() => signIn('google', { callbackUrl: '/account' })}
        className='w-full border-2 border-slate-300 font-bold py-3 rounded-xl mb-6 hover:bg-slate-50 flex items-center justify-center gap-2'>
        <svg className='w-5 h-5' viewBox='0 0 24 24'><path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z' fill='#4285F4'/><path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853'/><path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05'/><path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335'/></svg>
        Sign in with Google
      </button>
      <div className='flex items-center gap-3 mb-6'>
        <div className='flex-1 h-px bg-slate-300'/><span className='text-xs text-slate-500'>OR</span><div className='flex-1 h-px bg-slate-300'/>
      </div>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div><label htmlFor='login-email' className='text-sm font-medium block mb-1'>Email</label>
          <input id='login-email' data-testid='login-email' value={email} onChange={e => setEmail(e.target.value)} type='email' required className='w-full border rounded-lg px-3 py-2.5 text-sm' /></div>
        <div><label htmlFor='login-password' className='text-sm font-medium block mb-1'>Password</label>
          <input id='login-password' data-testid='login-password' value={password} onChange={e => setPassword(e.target.value)} type='password' required className='w-full border rounded-lg px-3 py-2.5 text-sm' /></div>
        <button type='submit' data-testid='login-submit' disabled={loading} className='w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50'>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className='text-center text-sm text-slate-500 mt-6'>
        Don&apos;t have an account? <Link href='/wholesale' className='text-blue-600 font-medium'>Apply for Wholesale</Link>
      </p>
    </section>
  )
}
