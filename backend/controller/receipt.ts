import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { parseReceiptWithLLM } from "../services/LLM";

export const parseReceipt = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Receipt image is required",
      });
    }
    const extractedData = await parseReceiptWithLLM(req.file.path);
    return res.json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to parse receipt",
    });
  }
};

export const saveReceipt = async (req: Request, res: Response) => {
  try {
    const receiptData = req.body;

    const filePath = path.join(process.cwd(), "data", "receipts.json");

    const existingData = fs.readFileSync(filePath, "utf-8");

    const receipts = JSON.parse(existingData);

    receipts.push({
      id: Date.now(),
      ...receiptData,
    });

    fs.writeFileSync(filePath, JSON.stringify(receipts, null, 2));

    return res.json({
      success: true,
      message: "Receipt saved successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save receipt",
    });
  }
};
