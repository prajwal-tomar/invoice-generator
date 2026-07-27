# Freelancer Invoice Generator

A clean, professional invoice builder for freelancers. Fill in your business and client details, add line items, apply GST, and download a PDF.

## Features

- Your business details and client billing information
- Invoice number, date, and optional due date
- Line items with quantity, rate, and automatic amount calculation
- Configurable GST rate with subtotal, tax, and total
- Live invoice preview
- Download as PDF

## Quick start

Clone into a **new** folder (do not run `git clone` if you are already inside `invoice-generator`):

```bash
git clone https://github.com/prajwal-tomar/invoice-generator.git
cd invoice-generator
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

`package.json` for the app is in `invoice-app/`. From the repo root, `npm install` installs dependencies there automatically. You can also work directly in that folder:

```bash
cd invoice-app
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

(from the repo root, or run the same commands inside `invoice-app/`)
