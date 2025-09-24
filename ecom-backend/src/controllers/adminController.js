import prisma from "../prismaClient.js";

export const getPendingStores = async (req, res) => {
  try {
    const pendingStores = await prisma.store.findMany({
      where: { status: "pending" },
      include: { owner: { select: { name: true, email: true } } }, 
    });
    res.json(pendingStores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approveStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    // 1. Ubah status toko menjadi "approved"
    const approvedStore = await prisma.store.update({
      where: { id: parseInt(storeId) },
      data: { status: "approved" },
    });

    // 2. Ubah role pemilik toko menjadi "SELLER"
    await prisma.user.update({
      where: { id: approvedStore.ownerId },
      data: { role: "SELLER" },
    });

    // await sendEmail(ownerEmail, "Store Approved", "Your store has been approved!");

    res.json({ message: "Store approved and user role updated to SELLER." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Menolak permintaan toko
export const rejectStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    await prisma.store.update({
      where: { id: parseInt(storeId) },
      data: { status: "rejected" },
    });

    res.json({ message: "Store request has been rejected." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};