import express from "express";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getFinancialReport,
} from "../controllers/TransactionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/report", authMiddleware, roleMiddleware, getFinancialReport);
router.get("/", authMiddleware, roleMiddleware, getTransactions);
router.get("/:id", authMiddleware, roleMiddleware, getTransactionById);
router.post("/", authMiddleware, roleMiddleware, createTransaction);
router.put("/:id", authMiddleware, roleMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, roleMiddleware, deleteTransaction);

export default router;
