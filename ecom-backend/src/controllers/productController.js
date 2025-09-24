import prisma from "../prismaClient.js";

// === UNTUK SELLER ===

// Membuat produk baru
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, storeId } = req.body;
    const sellerId = req.user.id;

    // Verifikasi kepemilikan toko
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store || store.ownerId !== sellerId) {
      return res.status(403).json({ message: "Forbidden: You don't own this store" });
    }

    const product = await prisma.product.create({
      data: { name, description, price, stock, storeId },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mengupdate produk
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;
    const { name, description, price, stock } = req.body;

    // Verifikasi bahwa produk ini milik seller yang sedang login
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { store: true },
    });

    if (!product || product.store.ownerId !== sellerId) {
      return res.status(403).json({ message: "Forbidden: You cannot edit this product" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, price, stock },
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Menghapus produk
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    // Verifikasi kepemilikan sebelum menghapus
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { store: true },
    });

    if (!product || product.store.ownerId !== sellerId) {
      return res.status(403).json({ message: "Forbidden: You cannot delete this product" });
    }

    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan semua produk milik seller yang sedang login
export const getMyProducts = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const products = await prisma.product.findMany({
            where: {
                store: {
                    ownerId: sellerId,
                },
            },
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// === UNTUK PUBLIK / CUSTOMER ===

// Mendapatkan semua produk untuk ditampilkan ke publik
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { images: true } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Mendapatkan detail satu produk
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { images: true, store: true },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};