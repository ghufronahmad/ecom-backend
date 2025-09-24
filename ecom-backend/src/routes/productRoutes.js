// src/routes/productRoutes.js

import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getAllProducts,
  getProductById,
} from "../controllers/productController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMidleware.js";

const router = express.Router();

// --- Rute Publik (Untuk Customer) ---
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// --- Rute Terproteksi (Hanya Untuk Seller) ---
const sellerOnly = roleMiddleware(['SELLER']);

router.post("/", authMiddleware, sellerOnly, createProduct);
router.put("/:id", authMiddleware, sellerOnly, updateProduct);
router.delete("/:id", authMiddleware, sellerOnly, deleteProduct);
router.get("/my-products/all", authMiddleware, sellerOnly, getMyProducts);

export default router;