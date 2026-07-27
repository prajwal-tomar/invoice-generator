import type { InvoiceData, InvoiceTotals, LineItem } from '../types'

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function addDaysISO(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export function defaultInvoiceNumber(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 900) + 100)
  return `INV-${y}${m}${d}-${seq}`
}

export function createEmptyItem(): LineItem {
  return {
    id: createId(),
    description: '',
    quantity: 1,
    rate: 0,
  }
}

export function createDefaultInvoice(): InvoiceData {
  return {
    invoiceNumber: defaultInvoiceNumber(),
    invoiceDate: todayISO(),
    dueDate: addDaysISO(14),
    from: {
      name: '',
      email: '',
      address: '',
      phone: '',
      taxId: '',
    },
    client: {
      name: '',
      email: '',
      address: '',
      phone: '',
      taxId: '',
    },
    items: [createEmptyItem()],
    gstRate: 10,
    notes: 'Payment due within 14 days. Thank you for your business.',
    currency: 'AUD',
  }
}

export function lineAmount(item: LineItem): number {
  const qty = Number.isFinite(item.quantity) ? item.quantity : 0
  const rate = Number.isFinite(item.rate) ? item.rate : 0
  return qty * rate
}

export function calculateTotals(
  items: LineItem[],
  gstRate: number,
): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => sum + lineAmount(item), 0)
  const rate = Number.isFinite(gstRate) ? gstRate : 0
  const gst = subtotal * (rate / 100)
  const total = subtotal + gst
  return { subtotal, gst, total }
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export function formatDisplayDate(iso: string): string {
  if (!iso) return '—'
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
