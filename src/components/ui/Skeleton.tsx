import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-slate-200 rounded', className)} />
}

export function ProductCardSkeleton() {
  return (
    <div data-testid="product-card-skeleton" className='border border-slate-100 rounded-2xl overflow-hidden'>
      <Skeleton className='h-48 w-full rounded-none' />
      <div className='p-4 space-y-2'>
        <Skeleton className='h-3 w-1/3' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-6 w-1/2' />
        <Skeleton className='h-9 w-full mt-3' />
      </div>
    </div>
  )
}
