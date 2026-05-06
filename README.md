# Receipt Parser

A small full-stack web application that allows users to upload a receipt image, extract structured receipt data using OCR + LLM parsing, review and correct the extracted information, and save the corrected receipt.

---

# Tech Stack

## Frontend
- React
- TypeScript
- Tailwind CSS
- React Icons

## Backend
- Node.js
- Express
- TypeScript
- Multer

## AI / OCR
- Tesseract.js (OCR)
- Groq API (`llama-3.3-70b-versatile`) for structured extraction

---

# Features

- Upload JPG/PNG receipt images
- OCR text extraction from receipt images
- LLM-based structured parsing
- Editable correction flow
- Confidence + warning system
- Add / remove line items
- Save corrected receipt
- Download receipt JSON
- Progress loading overlay during parsing

---

# How To Run

## Backend

```bash
cd backend
npm install
npm run dev
```

Create `.env`

```env
GROQ_API_KEY=your_api_key
PORT=5000
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# API Endpoints

## Parse Receipt

```http
POST /api/receipts/parse
```

FormData:
- receipt → image file

---

## Save Receipt

```http
POST /api/receipts/save
```

Body:
```json
{
  "merchant": "",
  "date": "",
  "lineItems": [],
  "total": 0
}
```

---

# What did you build?

I built a small receipt parsing application that accepts receipt images, extracts structured data using OCR and an LLM pipeline, and allows the user to review and correct the extracted data before saving it locally.

The application focuses heavily on the correction workflow instead of treating AI output as perfectly reliable.

---

# Biggest tradeoffs I made and why

## 1. OCR + Text LLM instead of multimodal vision model

I intentionally separated OCR and semantic parsing instead of using an expensive multimodal model directly.

This made the system:
- cheaper
- easier to debug
- easier to inspect during failures
- simpler to run locally

The downside is that OCR quality directly affects extraction quality.

---

## 2. Focused on correction UX instead of perfect extraction

Receipt formats vary heavily and OCR can be noisy, so I prioritized making corrections easy for the user rather than trying to over-engineer prompts for perfect extraction accuracy.

This aligns better with how real AI-assisted products are typically used.

---

## 3. JSON file persistence instead of database

I used local JSON persistence to keep setup lightweight and focused on the core product flow instead of infrastructure.

With more time I would move this to Mongodb or Postgres.

---

# Where did you use an LLM, and for what?

I used:
- Groq (`llama-3.3-70b-versatile`) for converting noisy OCR text into structured receipt JSON.
- UI structuring, and prompt iteration.

I intentionally kept business logic and frontend state management handwritten.

---

# What would you do with another week?

If I had another week, I would add:

- better OCR preprocessing
- SQLite/Postgres persistence
- retry/fallback extraction strategies
- confidence highlighting at field level
- better mobile responsiveness
- automated tests for parsing edge cases
- PDF and multi-page receipt support

---

# What's one thing in this spec you'd push back on if I were your PM?

I would push back on evaluating extraction quality alone without considering the correction workflow.

Receipt OCR and parsing are inherently noisy problems because receipt formats vary significantly and image quality can be poor.

In a real product, making corrections fast and transparent is often more important than trying to achieve perfect extraction accuracy.