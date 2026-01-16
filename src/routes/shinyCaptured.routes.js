import express from "express";
import prisma from "../connection-db.js";

const router = express.Router();

router.get("/all", async (req, res) => {
    try {
        const shinyCaptured = await prisma.shinyCaptured.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json(shinyCaptured);
    } catch (error) {
        return res.status(500).json({ error: "Error listing shinys captureds" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const shinyCaptured = await prisma.shinyCaptured.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!shinyCaptured) {
            return res.status(404).json({ error: "Shiny captured not found" })
        }

        return res.status(200).json(shinyCaptured);
    } catch (error) {
        return res.status(500).json({ error: "Error when searching for shiny captured" });
    }
});

router.post("/create", async (req, res) => {
    try {
        const { pokemonName, pokemonId, encounters, isAlpha, isSecret,
            methodCaught, captureDate, stillHas, nature, showcaseId } = req.body;

        if (!pokemonName || !pokemonId || !showcaseId) {
            throw new Error("Validation error");
        }

        const shinyCaptured = await prisma.shinyCaptured.create({
            data: {
                pokemonName,
                pokemonId,
                encounters,
                isAlpha,
                isSecret,
                methodCaught,
                captureDate,
                stillHas,
                nature,
                showcaseId
            },
        });

        return res.status(201).json(shinyCaptured)

    } catch (error) {

        if (error.message === "Validation error") {
            return res
                .status(400)
                .json({ error: "Pokemon name, Pokemon ID and Showcase ID are required." });
        }

        return res.status(500).json({ error: "Error creating shiny captured" });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { pokemonName, pokemonId, encounters, isAlpha, isSecret, 
            methodCaught, captureDate, stillHas, nature, showcaseId } = req.body;

    try {
        const shinyCaptured = await prisma.shinyCaptured.findUnique({
            where: { id: Number(id) }
        });

        if (!shinyCaptured) {
            return res.status(404).json({ error: "Shiny captured not found" });
        }

        const updatedShinyCaptured = await prisma.shinyCaptured.update({
            where: { id: Number(id) },
            data: {
                ...(pokemonName && { pokemonName }),
                ...(pokemonId && { pokemonId }),
                ...(encounters !== undefined && { encounters }),
                ...(isAlpha !== undefined && { isAlpha }),
                ...(isSecret !== undefined && { isSecret }),
                ...(methodCaught && { methodCaught }),
                ...(captureDate && { captureDate }),
                ...(stillHas !== undefined && { stillHas }),
                ...(nature && { nature }),
                ...(showcaseId && { showcaseId })
            }
        });

        return res.status(200).json(updatedShinyCaptured);

    } catch (error) {
        return res.status(500).json({ error: "Error updating shiny captured" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const shinyCaptured = await prisma.shinyCaptured.findUnique({
            where: { id: Number(id) },
        });

        if (!shinyCaptured) {
            return res.status(404).json({ error: "Shiny captured not found" });
        }

        await prisma.shinyCaptured.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({ message: "Shiny captured successfully deleted." });
    } catch (error) {
        return res.status(500).json({ error: "Error deleting shiny captured" });
    }
})

export default router;
