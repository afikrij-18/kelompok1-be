import express from "express";
import {
  getExpenseCategories,
  getExpenseCategoryById,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
} from "../controllers/ExpenseCategoryController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("admin", "owner"), getExpenseCategories);
router.get("/:id", authMiddleware, roleMiddleware("admin", "owner"), getExpenseCategoryById);
router.post("/", authMiddleware, roleMiddleware("owner"), createExpenseCategory);
router.put("/:id", authMiddleware, roleMiddleware("owner"), updateExpenseCategory);
router.delete("/:id", authMiddleware, roleMiddleware("owner"), deleteExpenseCategory);

export default router;
