import { useState } from "react";
import type { ReceiptData } from "../types/receipt";

interface Props {
  receiptData: ReceiptData;
  setReceiptData: React.Dispatch<React.SetStateAction<ReceiptData | null>>;
}

function ReceiptEditor({ receiptData, setReceiptData }: Props) {
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: keyof ReceiptData, value: any) => {
    setReceiptData({
      ...receiptData,
      [field]: value,
    });
  };

  const updateItem = (
    index: number,
    field: "name" | "amount",
    value: string
  ) => {
    const updatedItems = [...receiptData.lineItems];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === "amount" ? Number(value) : value,
    };

    updateField("lineItems", updatedItems);
  };

  const addItem = () => {
    updateField("lineItems", [
      ...receiptData.lineItems,
      { name: "", amount: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    updateField(
      "lineItems",
      receiptData.lineItems.filter((_, i) => i !== index)
    );
  };

  const buildReadableReceipt = () => {
    const items =
      receiptData.lineItems.length > 0
        ? receiptData.lineItems
            .map(
              (item, index) =>
                `${index + 1}. ${item.name || "Unnamed item"} - ₹${
                  item.amount || 0
                }`
            )
            .join("\n")
        : "No line items added.";

    const warnings =
      receiptData.warnings?.length > 0
        ? receiptData.warnings.map((w) => `- ${w}`).join("\n")
        : "No warnings.";

    return `
RECEIPT DETAILS
==============================

Merchant:
${receiptData.merchant || "Not provided"}

Date:
${receiptData.date || "Not provided"}

Confidence:
${receiptData.confidence || 0}%

Likely Receipt:
${receiptData.isLikelyReceipt ? "Yes" : "No"}

Line Items:
${items}

Total:
₹${receiptData.total || 0}

Warnings:
${warnings}

==============================
Saved At:
${new Date().toLocaleString()}
`.trim();
  };

  const downloadReceiptText = () => {
    const readableText = buildReadableReceipt();

    const blob = new Blob([readableText], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `receipt-${Date.now()}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const res = await fetch("http://localhost:5000/api/receipts/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(receiptData),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to save receipt");
        return;
      }

      setShowToast(true);
      downloadReceiptText();

      setTimeout(() => {
        setShowToast(false);
      }, 2500);
    } catch (error) {
      console.log(error);
      alert("Failed to save receipt");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Review Extracted Data
        </h2>

        <span
          className={`w-fit text-xs font-semibold px-3 py-1 rounded-full ${
            receiptData.isLikelyReceipt
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {receiptData.isLikelyReceipt ? "Likely Receipt" : "Check Image"}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Confidence: {receiptData.confidence}%
      </p>

      {receiptData.warnings?.length > 0 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          {receiptData.warnings.map((warning, index) => (
            <p key={index} className="text-sm text-yellow-700">
              ⚠ {warning}
            </p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="text-sm font-medium text-gray-600">Merchant</label>
          <input
            value={receiptData.merchant}
            onChange={(e) => updateField("merchant", e.target.value)}
            className="mt-1 w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Merchant name"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Date</label>
          <input
            value={receiptData.date}
            onChange={(e) => updateField("date", e.target.value)}
            type="date"
            className="mt-1 w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="font-semibold text-gray-800">Line Items</h3>

          <button
            onClick={addItem}
            className="w-full sm:w-auto text-sm bg-gray-900 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            + Add Item
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {receiptData.lineItems.length === 0 && (
            <div className="border border-dashed rounded-xl p-6 text-center text-gray-500">
              No line items detected. Add items manually.
            </div>
          )}

          {receiptData.lineItems.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-[1fr_120px_80px] gap-3"
            >
              <input
                value={item.name}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                placeholder="Item name"
                className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                value={item.amount}
                onChange={(e) => updateItem(index, "amount", e.target.value)}
                placeholder="Amount"
                className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => removeItem(index)}
                className="bg-red-50 text-red-600 rounded-xl py-3 sm:py-0 cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-medium text-gray-600">Total</label>
        <input
          type="number"
          value={receiptData.total}
          onChange={(e) => updateField("total", Number(e.target.value))}
          className="mt-1 w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Total amount"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all cursor-pointer"
      >
        {isSaving ? "Saving..." : "Save and Download"}
      </button>

      {showToast && (
        <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md px-6 sm:px-8 py-8 rounded-3xl shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-5 text-center">
              Receipt Saved
            </h2>

            <p className="text-gray-500 text-center mt-2 leading-7">
              Your receipt has been saved and downloaded successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceiptEditor;