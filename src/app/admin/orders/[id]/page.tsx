import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { formatCurrency } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { CheckCircle2, Calendar, Mail, Phone, MapPin } from 'lucide-react'
import { OrderStatusToggle } from '@/components/admin/OrderStatusToggle'

interface OrderItem {
  image: string
  name: string
  sku?: string
  qty: number
  price: number
}

interface ShippingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  city: string
  postalCode: string
  country: string
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id }
  })

  if (!order) notFound()

  const items = order.items as unknown as OrderItem[]
  const shippingData = order.shippingData as unknown as ShippingData

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-slate-800 italic'>Order {order.orderNumber}</h2>
          <div className='flex items-center gap-4 text-sm text-slate-500 mt-1'>
            <span className='flex items-center gap-1'><Calendar size={14}/> {new Date(order.createdAt).toLocaleString()}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
              order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
              'bg-slate-100 text-slate-600'
            }`}>{order.status}</span>
          </div>
        </div>
        <OrderStatusToggle orderId={order.id} currentStatus={order.status} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Items Table */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white rounded-2xl border border-slate-200 overflow-hidden'>
            <div className='p-6 border-b border-slate-100'>
              <h3 className='font-bold text-slate-800'>Order Items</h3>
            </div>
            <table className='w-full text-left'>
              <thead className='bg-slate-50 text-slate-500 font-medium text-xs uppercase'>
                <tr>
                  <th className='px-6 py-3'>Product</th>
                  <th className='px-6 py-3 text-center'>Qty</th>
                  <th className='px-6 py-3 text-right'>Price</th>
                  <th className='px-6 py-3 text-right'>Total</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 text-sm'>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded bg-slate-100 relative overflow-hidden'>
                          <Image src={item.image} alt={item.name} fill className='object-cover' />
                        </div>
                        <div>
                          <p className='font-bold text-slate-800'>{item.name}</p>
                          <p className='text-xs text-slate-500'>SKU: {item.sku || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-center'>{item.qty}</td>
                    <td className='px-6 py-4 text-right'>{formatCurrency(item.price, 'USD')}</td>
                    <td className='px-6 py-4 text-right font-bold'>{formatCurrency(item.price * item.qty, 'USD')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className='bg-slate-50 font-bold'>
                <tr>
                  <td colSpan={3} className='px-6 py-4 text-right'>Total</td>
                  <td className='px-6 py-4 text-right text-blue-600'>{formatCurrency(order.total, 'USD')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Sidebar: Customer & Shipping */}
        <div className='space-y-6'>
          <div className='bg-white p-6 rounded-2xl border border-slate-200 space-y-4'>
            <h3 className='font-bold text-slate-800 border-b border-slate-100 pb-3'>Customer Details</h3>
            <div className='space-y-3'>
              <p className='flex items-center gap-2 text-sm text-slate-600'>
                <CheckCircle2 size={16} className='text-blue-500' />
                {shippingData.firstName} {shippingData.lastName}
              </p>
              <p className='flex items-center gap-2 text-sm text-slate-600'>
                <Mail size={16} className='text-slate-400' />
                {shippingData.email}
              </p>
              <p className='flex items-center gap-2 text-sm text-slate-600'>
                <Phone size={16} className='text-slate-400' />
                {shippingData.phone}
              </p>
            </div>
          </div>

          <div className='bg-white p-6 rounded-2xl border border-slate-200 space-y-4'>
            <h3 className='font-bold text-slate-800 border-b border-slate-100 pb-3'>Shipping Address</h3>
            <div className='space-y-3'>
              <p className='flex items-start gap-2 text-sm text-slate-600 leading-relaxed'>
                <MapPin size={16} className='text-slate-400 mt-0.5' />
                <span>
                  {shippingData.address1}<br />
                  {shippingData.city}, {shippingData.postalCode}<br />
                  {shippingData.country}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
