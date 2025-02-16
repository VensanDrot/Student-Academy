import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const getImage = (req: Request, res: Response): void => {
    try {
        const { filename } = req.params; // Extract filename from URL
        if (!filename || typeof filename !== "string") {
            res.status(400).json({ message: "Missing or invalid file name" });
            return;
        }

        const imagePath = path.join(__dirname, "../../../../image", filename);

        if (!fs.existsSync(imagePath)) {
            res.status(404).json({ message: "Image not found" });
            return;
        }

        res.sendFile(imagePath);
    } catch (error) {
        console.error("Error serving image:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
