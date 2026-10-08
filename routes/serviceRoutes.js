import express from "express";
import { 
    getServices, 
    getServiceById, 
    createService, 
    updateService, 
    deleteService 
} from "../controllers/ServiceController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";


const router = express.Router();

// Route Publik (Bisa diakses siapa saja)
router.get("/", getServices);
router.get("/:id", getServiceById);

// Route Terproteksi (Hanya Admin & Owner yang sudah login)
router.post("/", authMiddleware, roleMiddleware, createService);
router.put("/:id", authMiddleware, roleMiddleware, updateService);
router.delete("/:id", authMiddleware, roleMiddleware, deleteService);

export default router;