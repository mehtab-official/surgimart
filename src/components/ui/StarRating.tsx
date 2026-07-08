'use client'
import { Star } from 'lucide-react'

interface Props { rating: number; size?: "xs" | "sm" | "md" }

export function StarRating({ rating, size = "md" }: Props) {
  const sz = { xs: 12, sm: 14, md: 16 }[size]
  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={sz}
          fill={i <= Math.round(rating) ? "#F59E0B" : "none"}
          color={i <= Math.round(rating) ? "#F59E0B" : "#CBD5E1"} />
      ))}
    </div>
  )
}
