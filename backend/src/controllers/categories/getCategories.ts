import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../../prisma/index";
import dotenv from "dotenv";

export const getCategories = async (req: Request, res: Response): Promise<any> => {
    try {
        const categories = await prisma.categories.findMany({
            take: 150,
        });

        return res.status(200).json({ message: "Success", data: categories });
    } catch (error: any) {
        console.error("Error refreshing token:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
