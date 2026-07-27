import type { InvoiceData, PartyDetails } from '../types'
import { createEmptyItem } from '../utils/invoice'

interface InvoiceFormProps {
  data: InvoiceData
  onChange: (next: InvoiceData) => void
}

function updateParty(
  data: InvoiceData,
  side: 'from' | 'client',
  field: keyof PartyDetails,
  value: string,
): InvoiceData {
  return {
    ...data,
    [side]: {
      ...data[side],
      [field]: value,
    },
  }
}

export function InvoiceForm({ data, onChange }: InvoiceFormProps) {
  return (
    <div className="form-stack">
      <section className="form-section">
        <h2>Invoice details</h2>
        <div className="field-grid">
          <label className="field">
            <span>Invoice number</span>
            <input
              type="text"
              value={data.invoiceNumber}
              onChange={(e) =>
                onChange({ ...data, invoiceNumber: e.target.value })
              }
            />
          </label>
          <label className="field">
            <span>Invoice date</span>
            <input
              type="date"
              value={data.invoiceDate}
              onChange={(e) =>
                onChange({ ...data, invoiceDate: e.target.value })
              }
            />
          </label>
          <label className="field">
            <span>Due date</span>
            <input
              type="date"
              value={data.dueDate}
              onChange={(e) => onChange({ ...data, dueDate: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Currency</span>
            <select
              value={data.currency}
              onChange={(e) => onChange({ ...data, currency: e.target.value })}
            >
              <option value="AUD">AUD</option>
              <option value="USD">USD</option>
              <option value="NZD">NZD</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
              <option value="SGD">SGD</option>
              <option value="INR">INR</option>
              <option value="CAD">CAD</option>
            </select>
          </label>
          <label className="field">
            <span>GST rate (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={data.gstRate}
              onChange={(e) =>
                onChange({
                  ...data,
                  gstRate: Number.parseFloat(e.target.value) || 0,
                })
              }
            />
          </label>
        </div>
      </section>

      <section className="form-section">
        <h2>From (you)</h2>
        <div className="field-grid">
          <label className="field field-span-2">
            <span>Business / name</span>
            <input
              type="text"
              placeholder="Your business name"
              value={data.from.name}
              onChange={(e) =>
                onChange(updateParty(data, 'from', 'name', e.target.value))
              }
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@studio.com"
              value={data.from.email}
              onChange={(e) =>
                onChange(updateParty(data, 'from', 'email', e.target.value))
              }
            />
          </label>
          <label className="field">
            <span>Phone</span>
            <input
              type="tel"
              placeholder="+61 400 000 000"
              value={data.from.phone}
              onChange={(e) =>
                onChange(updateParty(data, 'from', 'phone', e.target.value))
              }
            />
          </label>
          <label className="field field-span-2">
            <span>Address</span>
            <textarea
              rows={2}
              placeholder="Street, city, postcode"
              value={data.from.address}
              onChange={(e) =>
                onChange(updateParty(data, 'from', 'address', e.target.value))
              }
            />
          </label>
          <label className="field">
            <span>ABN / Tax ID</span>
            <input
              type="text"
              placeholder="ABN 12 345 678 901"
              value={data.from.taxId}
              onChange={(e) =>
                onChange(updateParty(data, 'from', 'taxId', e.target.value))
              }
            />
          </label>
        </div>
      </section>

      <section className="form-section">
        <h2>Bill to (client)</h2>
        <div className="field-grid">
          <label className="field field-span-2">
            <span>Client name</span>
            <input
              type="text"
              placeholder="Client or company name"
              value={data.client.name}
              onChange={(e) =>
                onChange(updateParty(data, 'client', 'name', e.target.value))
              }
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="accounts@client.com"
              value={data.client.email}
              onChange={(e) =>
                onChange(updateParty(data, 'client', 'email', e.target.value))
              }
            />
          </label>
          <label className="field">
            <span>Phone</span>
            <input
              type="tel"
              value={data.client.phone}
              onChange={(e) =>
                onChange(updateParty(data, 'client', 'phone', e.target.value))
              }
            />
          </label>
          <label className="field field-span-2">
            <span>Address</span>
            <textarea
              rows={2}
              placeholder="Client billing address"
              value={data.client.address}
              onChange={(e) =>
                onChange(updateParty(data, 'client', 'address', e.target.value))
              }
            />
          </label>
          <label className="field">
            <span>Tax ID (optional)</span>
            <input
              type="text"
              value={data.client.taxId}
              onChange={(e) =>
                onChange(updateParty(data, 'client', 'taxId', e.target.value))
              }
            />
          </label>
        </div>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <h2>Line items</h2>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              onChange({ ...data, items: [...data.items, createEmptyItem()] })
            }
          >
            Add item
          </button>
        </div>

        <div className="line-items">
          {data.items.map((item, index) => (
            <div key={item.id} className="line-item">
              <label className="field field-grow">
                <span>Description</span>
                <input
                  type="text"
                  placeholder="Design, development, consulting…"
                  value={item.description}
                  onChange={(e) => {
                    const items = data.items.map((row) =>
                      row.id === item.id
                        ? { ...row, description: e.target.value }
                        : row,
                    )
                    onChange({ ...data, items })
                  }}
                />
              </label>
              <label className="field field-qty">
                <span>Qty</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => {
                    const items = data.items.map((row) =>
                      row.id === item.id
                        ? {
                            ...row,
                            quantity: Number.parseFloat(e.target.value) || 0,
                          }
                        : row,
                    )
                    onChange({ ...data, items })
                  }}
                />
              </label>
              <label className="field field-rate">
                <span>Rate</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) => {
                    const items = data.items.map((row) =>
                      row.id === item.id
                        ? {
                            ...row,
                            rate: Number.parseFloat(e.target.value) || 0,
                          }
                        : row,
                    )
                    onChange({ ...data, items })
                  }}
                />
              </label>
              <button
                type="button"
                className="btn btn-icon"
                aria-label={`Remove item ${index + 1}`}
                disabled={data.items.length === 1}
                onClick={() =>
                  onChange({
                    ...data,
                    items: data.items.filter((row) => row.id !== item.id),
                  })
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="form-section">
        <h2>Notes</h2>
        <label className="field">
          <span>Payment terms & notes</span>
          <textarea
            rows={3}
            value={data.notes}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
          />
        </label>
      </section>
    </div>
  )
}
