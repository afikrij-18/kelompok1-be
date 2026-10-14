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

// Semua akses user management hanya untuk OWNER
router.get("/", authMiddleware, roleMiddleware("owner"), getUsers);
router.get("/:id", authMiddleware, roleMiddleware("owner"), getUserById);
router.post("/", authMiddleware, roleMiddleware("owner"), createUser);
router.put("/:id", authMiddleware, roleMiddleware("owner"), updateUser);
router.delete("/:id", authMiddleware, roleMiddleware("owner"), deleteUser);
router.put("/:id/password", authMiddleware, roleMiddleware("owner"), updateUserPassword);

export default router;
