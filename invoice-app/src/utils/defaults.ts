import type { InvoiceData, LineItem } from '../types'

export function createLineItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    rate: 0,
  }
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function defaultInvoiceNumber(): string {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  return `INV-${year}${month}-001`
}

export function createInitialInvoice(): InvoiceData {
  return {
    business: {
      name: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
    },
    client: {
      name: '',
      email: '',
      address: '',
    },
    meta: {
      number: defaultInvoiceNumber(),
      date: todayIso(),
      dueDate: '',
    },
    lineItems: [createLineItem()],
    gstRate: 10,
    notes: 'Thank you for your business.',
  }
}
