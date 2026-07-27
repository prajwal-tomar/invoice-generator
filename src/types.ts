export interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
}

export interface PartyDetails {
  name: string
  email: string
  address: string
  phone: string
  taxId: string
}

export interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  from: PartyDetails
  client: PartyDetails
  items: LineItem[]
  gstRate: number
  notes: string
  currency: string
}

export interface InvoiceTotals {
  subtotal: number
  gst: number
  total: number
}
