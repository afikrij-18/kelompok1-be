import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/ProductController.js";



const router = express.Router();

router.get("/", authMiddleware, getProducts);
router.get("/:id", authMiddleware, getProductById);
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;