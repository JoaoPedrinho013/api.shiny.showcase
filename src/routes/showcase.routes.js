import express from "express";
import prisma from "../connection-db.js";

const router = express.Router();

router.get("/all", async (req, res) => {
    try {
        const showcases = await prisma.showcase.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json(showcases);
    } catch (error) {
        return res.status(500).json({ error: "Error listing showcases" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const showcase = await prisma.showcase.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!showcase) {
            return res.status(404).json({ error: "Showcase not found" })
        }

        return res.status(200).json(showcase);
    } catch (error) {
        return res.status(500).json({ error: "Error when searching for showcase" });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    try {
        const showcase = await prisma.showcase.findUnique({
            where: { id: Number(id) }
        });

        if (!showcase) {
            return res.status(404).json({ error: "Showcase not found" });
        }

        const showcaseUpdate = await prisma.showcase.update({
            where: { id: Number(id) },
            data: {
                ...(title && { title })
            }
        });
        return res.status(200).json(`showcase updated successfully: ${showcaseUpdate}`);

    } catch (error) {
        return res.status(500).json({ error: "Error updating showcase" });
    }
});

export default router;
