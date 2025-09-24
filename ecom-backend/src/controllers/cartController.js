import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await prisma.cart.findMany({
      where: { userId: Number(userId) },
      include: { product: true },
    });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Cek apakah product sudah ada di cart
    const existing = await prisma.cart.findFirst({
      where: { userId: Number(userId), productId: Number(productId) },
    });

    let cartItem;
    if (existing) {
      cartItem = await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      cartItem = await prisma.cart.create({
        data: {
          userId: Number(userId),
          productId: Number(productId),
          quantity,
        },
      });
    }

    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update quantity
export const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cartItem = await prisma.cart.update({
      where: { id: Number(id) },
      data: { quantity },
    });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cart.delete({ where: { id: Number(id) } });
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
