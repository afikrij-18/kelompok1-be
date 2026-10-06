import express from "express";
import {
  getProfile,
  login,
  logout,
  updatePassword,
  updateProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.get("/me", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

router.put("/password", authMiddleware, updatePassword);

router.post("/logout", authMiddleware, logout);

export default router;
