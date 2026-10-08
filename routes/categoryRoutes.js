import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware, getCategories);
router.get("/:id", authMiddleware, roleMiddleware, getCategoryById);
router.post("/", authMiddleware, roleMiddleware, createCategory);
router.put("/:id", authMiddleware, roleMiddleware, updateCategory);
router.patch("/:id", authMiddleware, roleMiddleware, updateCategory);
router.delete("/:id", authMiddleware, roleMiddleware, deleteCategory);

export default router;
