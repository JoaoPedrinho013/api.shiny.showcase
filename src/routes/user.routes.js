import express from "express";
import prisma from "../connection-db.js";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { uploadUserImage } from "../middlewares/uploadUserImage.js";
import { deleteFile } from "../utils/deleteFile.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error listing users:", error);
    return res.status(500).json({ error: "Error listing users" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error searching for user:", error);
    return res.status(500).json({ error: "Error when searching for user" });
  }
});

router.post("/create", uploadUserImage.single("file"), async (req, res) => {
  let uploadedFilePath = null;

  try {
    const { name, email, password, guild, guildAcronym } = req.body;

    if (req.file) {
      uploadedFilePath = req.file.path;
    }

    if (!name || !email || !password) {
      throw new Error("Validation error");
    }

    if (password.length < 4) {
      throw new Error("Password too short.");
    }

    const password_hash = await bcrypt.hash(password, 10);

    const imagePath = req.file
      ? `uploads/users/${req.file.filename}`
      : null;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        guild,
        guildAcronym,
        imagePath,
      },
    });

    return res.status(201).json(`User created with email: ${user.email}`);
  } catch (error) {
    console.error("Error creating user:", error);

    if (uploadedFilePath) {
      deleteFile(uploadedFilePath);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json({ error: "Email already registered" });
      }
    }

    if (error.message === "Password too short.") {
      return res
        .status(400)
        .json({ error: "The password must contain at least 4 characters." });
    }

    if (error.message === "Validation error") {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    if (error.message?.includes("PNG")) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Error creating user" });
  }
}
);

router.put("/:id", uploadUserImage.single("file"), async (req, res) => {
  const { id } = req.params;
  const { name, email, password, guild, guildAcronym } = req.body;

  let uploadedFilePath = null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      if (req.file) deleteFile(req.file.path);
      return res.status(404).json({ error: "User not found" });
    }

    if (req.file) {
      uploadedFilePath = req.file.path;
    }

    let password_hash;
    if (password) {
      if (password.length < 4) {
        throw new Error("Password too short.");
      }
      password_hash = await bcrypt.hash(password, 10);
    }

    let newImagePath = user.imagePath;

    if (req.file) {
      if (user.imagePath) {
        deleteFile(`src/${user.imagePath}`);
      }
      newImagePath = `uploads/users/${req.file.filename}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(password_hash && { password_hash }),
        ...(guild !== undefined && { guild }),
        ...(guildAcronym !== undefined && { guildAcronym }),
        imagePath: newImagePath,
      },
    });

    return res.status(200).json(`User ${updatedUser.name} changed successfully!`);
  } catch (error) {
    console.error("Error updation user:", error);

    if (uploadedFilePath) {
      deleteFile(uploadedFilePath);
    }

    if (error.message === "Password too short.") {
      return res
        .status(400)
        .json({ error: "The password must contain at least 4 characters." });
    }

    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already registered" });
    }

    return res.status(500).json({ error: "Error updating user" });
  }
}
);

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.imagePath) {
      deleteFile(`src/${user.imagePath}`);
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ message: "User successfully deleted." });
  } catch (error) {
    console.error("Error deleting user:", error);

    return res.status(500).json({ error: "Error deleting user" });
  }
});

export default router;