import type { Metadata } from 'next'
import { EventsClient } from './EventsClient'
import { GLOBAL_EXPOS_DATA } from '@/shared/data/events'

export const metadata: Metadata = {
  title: 'Medical Expos & International Trade Fairs | SubMedOrtho',
  description: 'Join SubMedOrtho at upcoming global medical exhibitions including MEDICA Germany, WHX Dubai, Expomed Eurasia, and FIME Miami.',
}

export default function EventsPage() {
  return <EventsClient initialEvents={GLOBAL_EXPOS_DATA} />
}
