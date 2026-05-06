"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReceiptWithLLM = parseReceiptWithLLM;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tesseract_js_1 = __importDefault(require("tesseract.js"));
async function parseReceiptWithLLM(imagePath) {
    const { data: { text }, } = await tesseract_js_1.default.recognize(imagePath, "eng");
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            temperature: 0,
            messages: [
                {
                    role: "system",
                    content: `
You are a receipt extraction engine.

Return ONLY valid JSON.

Format:
{
  "isLikelyReceipt": true,
  "confidence": 0,
  "merchant": "",
  "date": "",
  "lineItems": [
    {
      "name": "",
      "amount": 0
    }
  ],
  "total": 0,
  "warnings": []
}

Rules:
- OCR text may be noisy or incomplete
- confidence should be between 0 and 100
- Do not reject receipts only because OCR quality is poor
- If the text contains TOTAL, prices, THANK YOU, grocery items, or merchant-like text, it is likely a receipt
- Include only purchased items
- Ignore subtotal, tax, discounts, payment methods
- If something is unclear add warning
- Amounts must be numbers
`,
                },
                {
                    role: "user",
                    content: `
Extract structured receipt data from this OCR text:

${text}
`,
                },
            ],
        }),
    });
    const data = await groqRes.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
        throw new Error("No response from LLM");
    }
    const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    return JSON.parse(cleaned);
}
