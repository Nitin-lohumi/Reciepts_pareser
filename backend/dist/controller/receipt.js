"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveReceipt = exports.parseReceipt = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LLM_1 = require("../services/LLM");
const parseReceipt = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Receipt image is required",
            });
        }
        const extractedData = await (0, LLM_1.parseReceiptWithLLM)(req.file.path);
        return res.json({
            success: true,
            data: extractedData,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to parse receipt",
        });
    }
};
exports.parseReceipt = parseReceipt;
const saveReceipt = async (req, res) => {
    try {
        const receiptData = req.body;
        const filePath = path_1.default.join(process.cwd(), "data", "receipts.json");
        const existingData = fs_1.default.readFileSync(filePath, "utf-8");
        const receipts = JSON.parse(existingData);
        receipts.push({
            id: Date.now(),
            ...receiptData,
        });
        fs_1.default.writeFileSync(filePath, JSON.stringify(receipts, null, 2));
        return res.json({
            success: true,
            message: "Receipt saved successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to save receipt",
        });
    }
};
exports.saveReceipt = saveReceipt;
