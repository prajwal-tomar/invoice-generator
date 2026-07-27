import type { InvoiceData, LineItem } from '../types'
import { createLineItem } from '../utils/defaults'

interface InvoiceEditorProps {
  data: InvoiceData
  onChange: (data: InvoiceData) => void
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'date' | 'number'
  placeholder?: string
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        className="field-input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea
        className="field-input field-textarea"
        value={value}
        placeholder={placeholder}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function InvoiceEditor({ data, onChange }: InvoiceEditorProps) {
  const updateBusiness = (key: keyof InvoiceData['business'], value: string) => {
    onChange({ ...data, business: { ...data.business, [key]: value } })
  }

  const updateClient = (key: keyof InvoiceData['client'], value: string) => {
    onChange({ ...data, client: { ...data.client, [key]: value } })
  }

  const updateMeta = (key: keyof InvoiceData['meta'], value: string) => {
    onChange({ ...data, meta: { ...data.meta, [key]: value } })
  }

  const updateLineItem = (id: string, patch: Partial<LineItem>) => {
    onChange({
      ...data,
      lineItems: data.lineItems.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    })
  }

  const addLineItem = () => {
    onChange({ ...data, lineItems: [...data.lineItems, createLineItem()] })
  }

  const removeLineItem = (id: string) => {
    if (data.lineItems.length <= 1) return
    onChange({
      ...data,
      lineItems: data.lineItems.filter((item) => item.id !== id),
    })
  }

  return (
    <div className="editor">
      <section className="editor-section">
        <h2>Your details</h2>
        <div className="field-grid">
          <Field
            label="Business name"
            value={data.business.name}
            placeholder="Jane Doe Consulting"
            onChange={(v) => updateBusiness('name', v)}
          />
          <Field
            label="Email"
            type="email"
            value={data.business.email}
            placeholder="jane@example.com"
            onChange={(v) => updateBusiness('email', v)}
          />
          <Field
            label="Phone"
            value={data.business.phone}
            placeholder="+1 555 0100"
            onChange={(v) => updateBusiness('phone', v)}
          />
          <Field
            label="Tax ID / GST number"
            value={data.business.taxId}
            placeholder="Optional"
            onChange={(v) => updateBusiness('taxId', v)}
          />
        </div>
        <TextArea
          label="Address"
          value={data.business.address}
          placeholder="Street, city, country"
          onChange={(v) => updateBusiness('address', v)}
        />
      </section>

      <section className="editor-section">
        <h2>Client</h2>
        <div className="field-grid">
          <Field
            label="Client name"
            value={data.client.name}
            placeholder="Acme Corp"
            onChange={(v) => updateClient('name', v)}
          />
          <Field
            label="Client email"
            type="email"
            value={data.client.email}
            placeholder="billing@acme.com"
            onChange={(v) => updateClient('email', v)}
          />
        </div>
        <TextArea
          label="Client address"
          value={data.client.address}
          placeholder="Billing address"
          onChange={(v) => updateClient('address', v)}
        />
      </section>

      <section className="editor-section">
        <h2>Invoice</h2>
        <div className="field-grid">
          <Field
            label="Invoice number"
            value={data.meta.number}
            onChange={(v) => updateMeta('number', v)}
          />
          <Field
            label="Invoice date"
            type="date"
            value={data.meta.date}
            onChange={(v) => updateMeta('date', v)}
          />
          <Field
            label="Due date"
            type="date"
            value={data.meta.dueDate}
            onChange={(v) => updateMeta('dueDate', v)}
          />
          <Field
            label="GST rate (%)"
            type="number"
            value={data.gstRate}
            onChange={(v) =>
              onChange({ ...data, gstRate: parseFloat(v) || 0 })
            }
          />
        </div>
      </section>

      <section className="editor-section">
        <div className="section-heading">
          <h2>Line items</h2>
          <button type="button" className="btn-ghost" onClick={addLineItem}>
            + Add line
          </button>
        </div>
        <div className="line-items-editor">
          {data.lineItems.map((item, index) => (
            <div key={item.id} className="line-item-row">
              <span className="line-item-index">{index + 1}</span>
              <input
                className="field-input"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  updateLineItem(item.id, { description: e.target.value })
                }
              />
              <input
                className="field-input line-qty"
                type="number"
                min={0}
                step={1}
                value={item.quantity}
                onChange={(e) =>
                  updateLineItem(item.id, {
                    quantity: parseFloat(e.target.value) || 0,
                  })
                }
              />
              <input
                className="field-input line-rate"
                type="number"
                min={0}
                step={0.01}
                value={item.rate}
                onChange={(e) =>
                  updateLineItem(item.id, {
                    rate: parseFloat(e.target.value) || 0,
                  })
                }
              />
              <button
                type="button"
                className="btn-icon"
                aria-label="Remove line item"
                disabled={data.lineItems.length <= 1}
                onClick={() => removeLineItem(item.id)}
              >
                ×
              </button>
            </div>
          ))}
          <p className="line-items-hint">Qty × Rate = line amount (GST applied on subtotal)</p>
        </div>
      </section>

      <section className="editor-section">
        <TextArea
          label="Notes"
          value={data.notes}
          placeholder="Payment terms, bank details, thank-you note…"
          onChange={(v) => onChange({ ...data, notes: v })}
        />
      </section>
    </div>
  )
}
