import express from "express";
import upload from "../middleware/upload.middleware";
import {
  parseReceipt,
  saveReceipt,
} from "../controller/receipt";

const router = express.Router();

router.post(
  "/parse",
  upload.single("receipt"),
  parseReceipt
);

router.post("/save", saveReceipt);

export default router;