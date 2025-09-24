import express from "express";
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/", addToCart);
router.put("/:id", updateCart);
router.delete("/:id", removeFromCart);

export default router;
