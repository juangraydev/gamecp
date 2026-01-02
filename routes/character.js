import express from "express";

const router = express.Router();

// This is your single endpoint
router.post("/", async (req, res) => {
    const { characterName } = req.body;

    try {
        // 1. MODULE: Information
        const baseInfo = await CharService.getCharacterInfo(characterName);
        if (!baseInfo) return res.status(404).json({ message: "Character not found" });

        // 2. MODULE: Equipment, Inventory, & Bank (Parallel execution for speed)
        const [equipment, inventory, bank] = await Promise.all([
            CharService.getEquipmentModule(baseInfo.Serial, baseInfo),
            CharService.getInventoryModule(baseInfo.Serial),
            CharService.getBankModule(baseInfo.AccountSerial)
        ]);

        // Returns everything in one clean JSON object
        res.status(200).json({
            status: 200,
            data: { info: baseInfo, equipment, inventory, bank }
        });

    } catch (err) {
        res.status(500).json({ message: "Error fetching character data" });
    }
});

export default router;