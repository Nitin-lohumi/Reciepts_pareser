# 🧾 Receipt Parser AI

A small full-stack web application that accepts receipt images, extracts structured receipt data using OCR + LLM processing, allows users to review and correct extracted values, and saves the corrected receipt locally.

---

# 🚀 Live Demo

## Frontend
https://reciepts-pareser.vercel.app/

## Backend API
https://reciepts-pareser-3.onrender.com

---

# ✨ Features

- Upload JPG/PNG receipt images
- OCR-based text extraction
- AI-powered structured receipt parsing
- Editable correction workflow
- Confidence + warning system
- Add / remove line items
- Save corrected receipts
- Download receipt summary
- Responsive UI
- JSON-based local persistence
- Loading progress overlay during parsing

---

# 🛠 Tech Stack

## Frontend
- React
- TypeScript
- Tailwind CSS
- React Icons

## Backend
- Node.js
- Express.js
- TypeScript
- Multer

## OCR & AI
- Tesseract.js
- Groq API (`llama-3.3-70b-versatile`)

---

# 📂 Project Structure

```bash
receipt-parser/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── uploads/
│   ├── data/
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone <your-repository-url>
cd receipt-parser
```

---

# 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# ⚙️ Backend Setup

```bash
cd backend
npm install
npm run build
npm start
```

Backend runs on:

```bash
http://localhost:5000
```

---

#  Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key
```

---

#  API Endpoints

## Parse Receipt

```http
POST /api/receipts/parse
```

Request:
- FormData
- `receipt` → image file

---

## Save Receipt

```http
POST /api/receipts/save
```

---

# Question 1 — What did you build?

I built a small full-stack receipt parsing application that accepts receipt images, extracts structured data using OCR and an LLM pipeline, and allows users to review and correct the extracted data before saving it locally. The application focuses heavily on the correction workflow instead of assuming the AI output is always correct.

---

# Question 2 — What are the biggest tradeoffs you made, and why?

## 1. OCR + Text LLM instead of a multimodal vision model

I intentionally separated OCR and semantic parsing instead of using a heavier multimodal vision model directly. This made the system cheaper, easier to debug, and easier to inspect when extraction failed. The downside is that OCR quality directly impacts extraction accuracy.

---

## 2. Prioritizing correction UX over perfect extraction

Receipt formats vary significantly and OCR can be noisy, so I focused more on making corrections fast and editable instead of trying to engineer prompts for perfect extraction accuracy. In a real product, allowing fast human correction is often more reliable than over-optimizing AI extraction.

---

## 3. Local JSON persistence instead of a database

I used lightweight local JSON persistence to keep the project focused on the core parsing and correction workflow instead of infrastructure setup. With more time I would move this to SQLite or Postgres.

---

# Question 3 — Where did you use an LLM, and for what?

I used:
- Groq (`llama-3.3-70b-versatile`) for converting noisy OCR text into structured receipt JSON.
- ChatGPT for implementation planning, prompt iteration, UI structuring, and refining edge cases in extraction logic.
- AI assistance for improving warning generation and confidence handling.

I intentionally wrote the backend API flow, frontend state management, correction UX, and persistence logic manually.

---

# Question 4 — What would you do with another week?

If I had another week, I would add:

- Mongodb/Postgres persistence
- Authentication
- Field-level confidence highlighting
- Better mobile responsiveness
- Automated tests for parsing edge cases
- PDF and multi-page receipt support
- Retry/fallback extraction strategies
- Better validation for malformed receipts

---

# Question 5 — What's one thing in this spec you'd push back on if I were your PM?

I would push back on evaluating extraction quality alone without considering the correction workflow.

Receipt OCR and parsing are inherently noisy problems because receipt formats vary heavily and image quality is often inconsistent. In practice, making corrections transparent and easy for the user is usually more important than trying to achieve perfect extraction accuracy.

I would also clarify what level of extraction reliability is expected before optimizing heavily for OCR accuracy, because the engineering approach changes significantly depending on whether the goal is speed, cost efficiency, or near-perfect extraction.

---

# 📄 Notes

- Running locally was prioritized over production infrastructure complexity.
- The application intentionally exposes warnings and confidence levels instead of hiding extraction uncertainty.
- The parsing pipeline:
  
```txt
Receipt Image
    ↓
OCR Extraction (Tesseract.js)
    ↓
LLM Parsing (Groq)
    ↓
Structured JSON
    ↓
Human Review & Correction
```
