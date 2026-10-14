import express from "express";
import {
  getBanks,
  createBank,
  updateBank,
  deleteBank,
} from "../controllers/BankController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Admin butuh GET untuk dropdown pembayaran; mutasi hanya owner
router.get("/", authMiddleware, roleMiddleware("admin", "owner"), getBanks);
router.post("/", authMiddleware, roleMiddleware("owner"), createBank);
router.put("/:id", authMiddleware, roleMiddleware("owner"), updateBank);
router.delete("/:id", authMiddleware, roleMiddleware("owner"), deleteBank);

export default router;
