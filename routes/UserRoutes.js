import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
} from "../controllers/UserController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ========================================
// USER ROUTES
// ========================================

// GET semua user
router.get("/", authMiddleware, roleMiddleware, getUsers);

// GET user berdasarkan ID
router.get("/:id", authMiddleware, roleMiddleware, getUserById);

// CREATE user
router.post("/", authMiddleware, roleMiddleware, createUser);

// UPDATE user
router.put("/:id", authMiddleware, roleMiddleware, updateUser);

// DELETE user
router.delete("/:id", authMiddleware, roleMiddleware, deleteUser);

// UPDATE password user
router.put("/:id/password", authMiddleware, roleMiddleware, updateUserPassword);

export default router;
