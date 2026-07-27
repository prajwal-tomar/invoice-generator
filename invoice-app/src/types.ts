export interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
}

export interface BusinessDetails {
  name: string
  email: string
  phone: string
  address: string
  taxId: string
}

export interface ClientDetails {
  name: string
  email: string
  address: string
}

export interface InvoiceMeta {
  number: string
  date: string
  dueDate: string
}

export interface InvoiceData {
  business: BusinessDetails
  client: ClientDetails
  meta: InvoiceMeta
  lineItems: LineItem[]
  gstRate: number
  notes: string
}
