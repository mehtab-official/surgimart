export default function Loading() {
  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <div data-testid='loading-spinner' className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
        <p className='text-sm text-slate-500 font-medium'>Loading...</p>
      </div>
    </div>
  )
}
