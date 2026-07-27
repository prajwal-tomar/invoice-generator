import { useRef, useState } from 'react'
import { InvoiceForm } from './components/InvoiceForm'
import { InvoicePreview } from './components/InvoicePreview'
import { createDefaultInvoice, formatMoney, calculateTotals } from './utils/invoice'
import { downloadInvoicePdf } from './utils/pdf'
import type { InvoiceData } from './types'
import './App.css'

function App() {
  const [data, setData] = useState<InvoiceData>(() => createDefaultInvoice())
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const totals = calculateTotals(data.items, data.gstRate)

  async function handleDownload() {
    if (!previewRef.current) return
    setError(null)
    setDownloading(true)
    try {
      await downloadInvoicePdf(previewRef.current, data.invoiceNumber || 'invoice')
    } catch {
      setError('Could not generate PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden="true" />

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            F
          </span>
          <div>
            <p className="brand-name">Folio</p>
            <p className="brand-tag">Freelancer invoices</p>
          </div>
        </div>

        <div className="topbar-actions">
          <p className="running-total">
            Total{' '}
            <strong>{formatMoney(totals.total, data.currency)}</strong>
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Preparing PDF…' : 'Download PDF'}
          </button>
        </div>
      </header>

      {error ? <p className="banner-error" role="alert">{error}</p> : null}

      <main className="workspace">
        <aside className="editor-panel">
          <div className="panel-intro">
            <h1>Create invoice</h1>
            <p>Fill in the details and download a clean PDF for your client.</p>
          </div>
          <InvoiceForm data={data} onChange={setData} />
        </aside>

        <section className="preview-panel" aria-label="Invoice preview">
          <div className="preview-toolbar">
            <h2>Preview</h2>
            <button
              type="button"
              className="btn btn-primary btn-mobile-download"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? 'Preparing PDF…' : 'Download PDF'}
            </button>
          </div>
          <InvoicePreview data={data} previewRef={previewRef} />
        </section>
      </main>
    </div>
  )
}

export default App
