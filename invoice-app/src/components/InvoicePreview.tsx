import {
  formatMoney,
  gstAmount,
  lineItemAmount,
  subtotal,
  total,
} from '../utils/calculations'
import type { InvoiceData } from '../types'

interface InvoicePreviewProps {
  data: InvoiceData
}

function DetailBlock({
  title,
  lines,
}: {
  title: string
  lines: string[]
}) {
  const visible = lines.filter((line) => line.trim().length > 0)
  if (visible.length === 0) return null

  return (
    <div className="invoice-block">
      <p className="invoice-block-title">{title}</p>
      {visible.map((line) => (
        <p key={line} className="invoice-block-line">{line}</p>
      ))}
    </div>
  )
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
  const sub = subtotal(data.lineItems)
  const gst = gstAmount(sub, data.gstRate)
  const grandTotal = total(sub, data.gstRate)
  const formattedDate = data.meta.date
    ? new Date(data.meta.date + 'T12:00:00').toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'
  const formattedDue = data.meta.dueDate
    ? new Date(data.meta.dueDate + 'T12:00:00').toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const businessLines = [
    data.business.name,
    data.business.email,
    data.business.phone,
    data.business.address,
    data.business.taxId ? `Tax ID: ${data.business.taxId}` : '',
  ]

  const clientLines = [
    data.client.name,
    data.client.email,
    data.client.address,
  ]

  return (
    <article className="invoice-paper" aria-label="Invoice preview">
      <header className="invoice-header">
        <div>
          <h1 className="invoice-title">INVOICE</h1>
          <p className="invoice-brand">
            {data.business.name.trim() || 'Your Business Name'}
          </p>
        </div>
        <div className="invoice-meta-grid">
          <div>
            <span className="meta-label">Invoice #</span>
            <span className="meta-value">{data.meta.number || '—'}</span>
          </div>
          <div>
            <span className="meta-label">Date</span>
            <span className="meta-value">{formattedDate}</span>
          </div>
          {formattedDue && (
            <div>
              <span className="meta-label">Due date</span>
              <span className="meta-value">{formattedDue}</span>
            </div>
          )}
        </div>
      </header>

      <div className="invoice-parties">
        <DetailBlock title="From" lines={businessLines} />
        <DetailBlock title="Bill to" lines={clientLines} />
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th className="col-num">Qty</th>
            <th className="col-num">Rate</th>
            <th className="col-num">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item) => (
            <tr key={item.id}>
              <td>{item.description.trim() || '—'}</td>
              <td className="col-num">{item.quantity}</td>
              <td className="col-num">{formatMoney(item.rate)}</td>
              <td className="col-num">{formatMoney(lineItemAmount(item))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-totals">
        <div className="totals-row">
          <span>Subtotal</span>
          <span>{formatMoney(sub)}</span>
        </div>
        <div className="totals-row">
          <span>GST ({data.gstRate}%)</span>
          <span>{formatMoney(gst)}</span>
        </div>
        <div className="totals-row totals-grand">
          <span>Total due</span>
          <span>{formatMoney(grandTotal)}</span>
        </div>
      </div>

      {data.notes.trim() && (
        <footer className="invoice-notes">
          <p className="invoice-block-title">Notes</p>
          <p>{data.notes}</p>
        </footer>
      )}
    </article>
  )
}
