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

router.get("/report", authMiddleware, roleMiddleware("admin", "owner"), getFinancialReport);
router.get("/", authMiddleware, roleMiddleware("admin", "owner"), getTransactions);
router.get("/:id", authMiddleware, roleMiddleware("admin", "owner"), getTransactionById);
router.post("/", authMiddleware, roleMiddleware("admin", "owner"), createTransaction);
router.put("/:id", authMiddleware, roleMiddleware("owner"), updateTransaction);
router.delete("/:id", authMiddleware, roleMiddleware("owner"), deleteTransaction);

export default router;
