// src/routes/adminRoutes.js
import express from "express";
import { getPendingStores, approveStore, rejectStore } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMidleware.js";

const router = express.Router();
const adminOnly = roleMiddleware(['ADMIN']);

// Endpoint untuk admin melihat semua permintaan toko
// GET http://localhost:3000/api/admin/stores/pending
router.get("/stores/pending", authMiddleware, adminOnly, getPendingStores);

// Endpoint untuk admin menyetujui toko
// PUT http://localhost:3000/api/admin/stores/approve/1
router.put("/stores/approve/:storeId", authMiddleware, adminOnly, approveStore);

// Endpoint untuk admin menolak toko
// PUT http://localhost:3000/api/admin/stores/reject/1
router.put("/stores/reject/:storeId", authMiddleware, adminOnly, rejectStore);

export default router;