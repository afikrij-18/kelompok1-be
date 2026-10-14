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

router.get("/", authMiddleware, roleMiddleware("admin", "owner"), getCategories);
router.get("/:id", authMiddleware, roleMiddleware("admin", "owner"), getCategoryById);
router.post("/", authMiddleware, roleMiddleware("owner"), createCategory);
router.put("/:id", authMiddleware, roleMiddleware("owner"), updateCategory);
router.patch("/:id", authMiddleware, roleMiddleware("owner"), updateCategory);
router.delete("/:id", authMiddleware, roleMiddleware("owner"), deleteCategory);

export default router;
