import type { RefObject } from 'react'
import type { InvoiceData } from '../types'
import {
  calculateTotals,
  formatDisplayDate,
  formatMoney,
  lineAmount,
} from '../utils/invoice'

interface InvoicePreviewProps {
  data: InvoiceData
  previewRef: RefObject<HTMLDivElement | null>
}

function PartyBlock({
  label,
  name,
  email,
  phone,
  address,
  taxId,
}: {
  label: string
  name: string
  email: string
  phone: string
  address: string
  taxId: string
}) {
  return (
    <div className="party-block">
      <p className="party-label">{label}</p>
      <p className="party-name">{name || '—'}</p>
      {address ? <p className="party-meta">{address}</p> : null}
      {email ? <p className="party-meta">{email}</p> : null}
      {phone ? <p className="party-meta">{phone}</p> : null}
      {taxId ? <p className="party-meta">{taxId}</p> : null}
    </div>
  )
}

export function InvoicePreview({ data, previewRef }: InvoicePreviewProps) {
  const totals = calculateTotals(data.items, data.gstRate)

  return (
    <div className="preview-stage">
      <div ref={previewRef} className="invoice-sheet">
        <header className="invoice-header">
          <div>
            <p className="invoice-brand">
              {data.from.name || 'Your business'}
            </p>
            <h1 className="invoice-title">Invoice</h1>
          </div>
          <div className="invoice-meta">
            <div className="meta-row">
              <span>Invoice #</span>
              <strong>{data.invoiceNumber || '—'}</strong>
            </div>
            <div className="meta-row">
              <span>Date</span>
              <strong>{formatDisplayDate(data.invoiceDate)}</strong>
            </div>
            <div className="meta-row">
              <span>Due</span>
              <strong>{formatDisplayDate(data.dueDate)}</strong>
            </div>
          </div>
        </header>

        <div className="invoice-parties">
          <PartyBlock label="From" {...data.from} />
          <PartyBlock label="Bill to" {...data.client} />
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th className="num">Qty</th>
              <th className="num">Rate</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id}>
                <td>{item.description || '—'}</td>
                <td className="num">{item.quantity || 0}</td>
                <td className="num">
                  {formatMoney(item.rate || 0, data.currency)}
                </td>
                <td className="num">
                  {formatMoney(lineAmount(item), data.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-totals">
          <div className="totals-row">
            <span>Subtotal</span>
            <span>{formatMoney(totals.subtotal, data.currency)}</span>
          </div>
          <div className="totals-row">
            <span>GST ({data.gstRate}%)</span>
            <span>{formatMoney(totals.gst, data.currency)}</span>
          </div>
          <div className="totals-row totals-grand">
            <span>Total</span>
            <span>{formatMoney(totals.total, data.currency)}</span>
          </div>
        </div>

        {data.notes ? (
          <footer className="invoice-notes">
            <p className="party-label">Notes</p>
            <p>{data.notes}</p>
          </footer>
        ) : null}
      </div>
    </div>
  )
}
