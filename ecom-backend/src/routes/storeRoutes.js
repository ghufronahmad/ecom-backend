import express from "express";
import { requestStore } from "../controllers/storeController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Endpoint untuk customer mengajukan pembuatan toko
// POST http://localhost:3000/api/stores/request
router.post("/request", authMiddleware, requestStore);

export default router;