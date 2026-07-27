import type { LineItem } from '../types'

export function lineItemAmount(item: LineItem): number {
  const qty = Number.isFinite(item.quantity) ? item.quantity : 0
  const rate = Number.isFinite(item.rate) ? item.rate : 0
  return qty * rate
}

export function subtotal(lineItems: LineItem[]): number {
  return lineItems.reduce((sum, item) => sum + lineItemAmount(item), 0)
}

export function gstAmount(subtotalValue: number, gstRate: number): number {
  const rate = Number.isFinite(gstRate) ? gstRate : 0
  return subtotalValue * (rate / 100)
}

export function total(subtotalValue: number, gstRate: number): number {
  return subtotalValue + gstAmount(subtotalValue, gstRate)
}

export function formatMoney(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
