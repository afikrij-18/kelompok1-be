import express from "express";
import { getServices, createService, updateService, deleteService, getServiceById } from "../controllers/ServiceControllerjs";

const router = express.Router();

router.get("/", getServices);
router.get("/:id", getServiceById);
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router; 