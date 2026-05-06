import dotenv from "dotenv";
dotenv.config();

import Tesseract from "tesseract.js";

export async function parseReceiptWithLLM(imagePath: string) {
  const {
    data: { text },
  } = await Tesseract.recognize(imagePath, "eng");
  const groqRes = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
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
    },
  );

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
