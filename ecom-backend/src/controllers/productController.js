import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true, store: true },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { images: true, store: true },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { storeId, name, description, price, stock, images } = req.body;
    const product = await prisma.product.create({
      data: {
        storeId: Number(storeId),
        name,
        description,
        price,
        stock,
        images: {
          create: images?.map((url) => ({ imageUrl: url })) || [],
        },
      },
      include: { images: true },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, description, price, stock },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
