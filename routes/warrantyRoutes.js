import express from "express";
import { checkWarranty, createClaim, getClaims, getClaimById, updateClaim, deleteClaim } from "../controllers/WarrantyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Cek garansi bisa via path param atau query param:
// GET /api/warranties/check/1  ATAU  GET /api/warranties/check?booking_unit_id=1
router.get("/check", authMiddleware, roleMiddleware("admin", "owner"), checkWarranty);
router.get("/check/:id", authMiddleware, roleMiddleware("admin", "owner"), checkWarranty);

// Claims
router.post("/claims", authMiddleware, roleMiddleware("admin", "owner"), createClaim);
router.get("/claims", authMiddleware, roleMiddleware("admin", "owner"), getClaims);
router.get("/claims/:id", authMiddleware, roleMiddleware("admin", "owner"), getClaimById);
router.put("/claims/:id", authMiddleware, roleMiddleware("admin", "owner"), updateClaim);
router.delete("/claims/:id", authMiddleware, roleMiddleware("owner"), deleteClaim);

// Alias lama agar file .rest versi awal tetap jalan:
// POST /api/warranties  -> createClaim
// GET  /api/warranties  -> getClaims
router.post("/", authMiddleware, roleMiddleware("admin", "owner"), createClaim);
router.get("/", authMiddleware, roleMiddleware("admin", "owner"), getClaims);

export default router;