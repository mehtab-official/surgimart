import type { Metadata } from 'next'
import { EventsClient } from './EventsClient'
import { GLOBAL_EXPOS_DATA } from '@/shared/data/events'

export const metadata: Metadata = {
  title: 'Medical Expos & International Trade Fairs | SubMedOrtho',
  description: 'Join SubMedOrtho at upcoming medical exhibitions in Pakistan and China, including Health Asia Karachi, CMEF Shanghai, Health Asia Lahore, and Canton Fair Guangzhou.',
}

export default function EventsPage() {
  return <EventsClient initialEvents={GLOBAL_EXPOS_DATA} />
}
