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

router.use(authMiddleware, roleMiddleware);

router.get("/", getBanks);
router.post("/", createBank);
router.put("/:id", updateBank);
router.delete("/:id", deleteBank);

export default router;
