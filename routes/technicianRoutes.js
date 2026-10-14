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

// Admin: lihat, tambah, edit. Owner: full + hapus.
router.get("/", authMiddleware, roleMiddleware("admin", "owner"), getTechnicians);
router.get("/:id", authMiddleware, roleMiddleware("admin", "owner"), getTechnicianById);
router.post("/", authMiddleware, roleMiddleware("admin", "owner"), createTechnician);
router.put("/:id", authMiddleware, roleMiddleware("admin", "owner"), updateTechnician);
router.delete("/:id", authMiddleware, roleMiddleware("owner"), deleteTechnician);

export default router;
