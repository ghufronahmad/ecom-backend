import prisma from "../prismaClient.js";

export const requestStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;

    // Cek apakah user sudah punya toko
    const existingStore = await prisma.store.findFirst({
      where: { ownerId: userId },
    });
    if (existingStore) {
      return res.status(400).json({ message: "You already own a store or have a pending request." });
    }

    // Buat toko baru dengan status "pending"
    const newStore = await prisma.store.create({
      data: {
        name,
        description,
        ownerId: userId,
        status: "pending", // Status default, menunggu persetujuan admin
      },
    });

    res.status(201).json({
      message: "Store request submitted successfully. Please wait for admin approval.",
      store: newStore,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};