import express from "express";
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/ExpenseController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("admin", "owner"), getExpenses);
router.get("/:id", authMiddleware, roleMiddleware("admin", "owner"), getExpenseById);
router.post("/", authMiddleware, roleMiddleware("admin", "owner"), createExpense);
router.put("/:id", authMiddleware, roleMiddleware("owner"), updateExpense);
router.delete("/:id", authMiddleware, roleMiddleware("owner"), deleteExpense);

export default router;
