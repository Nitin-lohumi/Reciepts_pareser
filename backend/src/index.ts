import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import receiptRoutes from "../routes/receipt.routes";

// https://reciepts-pareser.vercel.app/
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/receipts", receiptRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});