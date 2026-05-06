export interface LineItem {
  name: string;
  amount: number;
}

export interface ReceiptData {
  isLikelyReceipt: boolean;
  confidence: number;
  merchant: string;
  date: string;
  lineItems: LineItem[];
  total: number;
  warnings: string[];
}