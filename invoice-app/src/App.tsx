import { useRef, useState } from 'react'
import { InvoiceEditor } from './components/InvoiceEditor'
import { InvoicePreview } from './components/InvoicePreview'
import { createInitialInvoice } from './utils/defaults'
import { downloadInvoicePdf } from './utils/pdf'
import type { InvoiceData } from './types'
import './App.css'

function App() {
  const [invoice, setInvoice] = useState<InvoiceData>(createInitialInvoice)
  const [exporting, setExporting] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleDownloadPdf = async () => {
    const node = previewRef.current
    if (!node || exporting) return

    setExporting(true)
    try {
      const safeNumber = invoice.meta.number.replace(/[^\w-]+/g, '_') || 'invoice'
      await downloadInvoicePdf(node, `${safeNumber}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-text">
          <h1>Freelancer Invoice</h1>
          <p>Create professional invoices with GST and export to PDF.</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          disabled={exporting}
          onClick={handleDownloadPdf}
        >
          {exporting ? 'Generating PDF…' : 'Download PDF'}
        </button>
      </header>

      <div className="app-layout">
        <InvoiceEditor data={invoice} onChange={setInvoice} />
        <div className="preview-panel">
          <p className="preview-label">Preview</p>
          <div ref={previewRef} className="preview-capture">
            <InvoicePreview data={invoice} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
