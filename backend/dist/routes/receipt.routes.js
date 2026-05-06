"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const receipt_1 = require("../controller/receipt");
const router = express_1.default.Router();
router.post("/parse", upload_middleware_1.default.single("receipt"), receipt_1.parseReceipt);
router.post("/save", receipt_1.saveReceipt);
exports.default = router;
