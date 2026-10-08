import express from "express";
import {
  getTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician,
} from "../controllers/TechnicianController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware, getTechnicians);
router.get("/:id", authMiddleware, roleMiddleware, getTechnicianById);
router.post("/", authMiddleware, roleMiddleware, createTechnician);
router.put("/:id", authMiddleware, roleMiddleware, updateTechnician);
router.delete("/:id", authMiddleware, roleMiddleware, deleteTechnician);

export default router;
