import express from "express";
import { checkWarranty, createClaim, getClaims, getClaimById, updateClaim, deleteClaim } from "../controllers/WarrantyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Cek garansi bisa via path param atau query param:
// GET /api/warranties/check/1  ATAU  GET /api/warranties/check?booking_unit_id=1
router.get("/check", authMiddleware, roleMiddleware, checkWarranty);
router.get("/check/:id", authMiddleware, roleMiddleware, checkWarranty);

// Claims
router.post("/claims", authMiddleware, roleMiddleware, createClaim);
router.get("/claims", authMiddleware, roleMiddleware, getClaims);
router.get("/claims/:id", authMiddleware, roleMiddleware, getClaimById);
router.put("/claims/:id", authMiddleware, roleMiddleware, updateClaim);
router.delete("/claims/:id", authMiddleware, roleMiddleware, deleteClaim);

// Alias lama agar file .rest versi awal tetap jalan:
// POST /api/warranties  -> createClaim
// GET  /api/warranties  -> getClaims
router.post("/", authMiddleware, roleMiddleware, createClaim);
router.get("/", authMiddleware, roleMiddleware, getClaims);

export default router;