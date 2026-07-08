import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderNumber(): string {
  // Full UUID without dashes gives 32 hex chars (128 bits of entropy).
  // We take 16 chars = 64 bits — collision probability is negligible even at
  // high order volume, while keeping the number human-readable.
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()
  return `SM-${id}`
}

export function convert(priceUSD: number, currency: string, rates: Record<string, number>): number {
  const rate = rates[currency] ?? 1
  return Math.round(priceUSD * rate * 100) / 100
}

export function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$', AED: 'AED ', GBP: '£', EUR: '€', PKR: 'Rs.', SAR: 'SAR ', QAR: 'QAR '
  }
  return (symbols[currency] ?? '') + amount.toFixed(2)
}

export function shippingBarPercent(subtotal: number, threshold: number): number {
  return Math.min((subtotal / threshold) * 100, 100)
}

export function amountToFreeShipping(subtotal: number, threshold: number): number {
  return Math.max(0, threshold - subtotal)
}

export function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) },
    (_, i) => array.slice(i * size, i * size + size))
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}
