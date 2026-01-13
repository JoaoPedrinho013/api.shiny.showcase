import express from "express";
import prisma from "../connection-db.js";
import { Prisma } from "@prisma/client";

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

router.post("/create", async (req, res) => {
    try {
        const { title, userId } = req.body;

        if (!title || !userId) {
            throw new Error("Validation error");
        }

        const showcase = await prisma.showcase.create({
            data: {
                title,
                userId,
            },
        });

        return res.status(201).json(showcase)

    } catch (error) {

        if (error.message === "Validation error") {
            return res
                .status(400)
                .json({ error: "Title and userId are required." });
        }

        return res.status(500).json({ error: "Error creating showcase" });
    }
});


//ARRUMAR PUT N TA FUNFANDO
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
            whre: { id: Number(id) },
            data: {
                ...(title && { title })
            }
        });
        return res.status(200).json(`showcase updated successfully: ${showcaseUpdate}`);

    } catch (error) {
        return res.status(500).json({ error: "Error updating showcase" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const showcase = await prisma.showcase.findUnique({
            where: { id: Number(id) },
        });

        if (!showcase) {
            return res.status(404).json({ error: "Showcase not found" });
        }

        await prisma.showcase.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({ message: "Showcase successfully deleted." });
    } catch (error) {
        return res.status(500).json({ error: "Error deleting showcase" });
    }
})
export default router;