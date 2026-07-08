'use client'
import { useState, useEffect } from 'react'
import { Download, Mail, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Subscriber {
  email: string
  createdAt: string
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetch('/api/admin/newsletter') // I'll need to create this API
      .then(res => res.json())
      .then(data => {
        setSubscribers(data.subscribers || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const exportToCSV = () => {
    setExporting(true)
    try {
      if (subscribers.length === 0) {
        toast.error('No subscribers to export')
        return
      }
      
      const csvRows = [
        ['Email', 'Date Subscribed'],
        ...subscribers.map(sub => [sub.email, new Date(sub.createdAt).toLocaleDateString()])
      ]
      
      const csvContent = "data:text/csv;charset=utf-8," 
          + csvRows.map(e => e.join(",")).join("\n")
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `surgimart_subscribers_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('CSV exported successfully')
    } catch {
      toast.error('Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-slate-800'>Newsletter Subscribers</h2>
          <p className='text-slate-500'>Manage your marketing mailing list.</p>
        </div>
        <button 
          onClick={exportToCSV}
          disabled={exporting || subscribers.length === 0}
          className='bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50'
        >
          {exporting ? <Loader2 size={20} className='animate-spin' /> : <Download size={20} />}
          Export CSV
        </button>
      </div>

      <div className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='bg-slate-50 text-slate-500 font-medium'>
              <tr>
                <th className='px-6 py-4'>Email Address</th>
                <th className='px-6 py-4 text-right'>Joined Date</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {loading ? (
                <tr><td colSpan={2} className='px-6 py-10 text-center'><Loader2 size={24} className='animate-spin mx-auto text-blue-600' /></td></tr>
              ) : subscribers.length > 0 ? subscribers.map((sub, i) => (
                <tr key={i} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <Mail size={16} className='text-slate-400' />
                      <span className='font-medium'>{sub.email}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-right text-slate-500'>
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={2} className='px-6 py-10 text-center text-slate-400'>No subscribers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
