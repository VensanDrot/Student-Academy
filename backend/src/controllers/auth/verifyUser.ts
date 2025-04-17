// src/controllers/authController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../../prisma/index";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const verifyUser = async (req: Request, res: Response): Promise<any> => {
    try {
        // 1. Get token from request body
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: "Verification token is required." });
        }

        // Verify the refresh token
        jwt.verify(token, JWT_REFRESH_SECRET, async (err: any, decoded: any) => {
            if (err) {
                return res.status(400).json({ error: "Invalid or expired verification token." });
            }

            // Check if user still exists
            const user = await prisma.users.update({
                where: { id: decoded.id },
                data: { verified: true },
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                },
            });

            if (!user) {
                return res.status(403).json({ message: "Forbidden: User no longer exists" });
            }

            // Generate a new access token
            const newAccessToken = jwt.sign(
                { id: user.id, email: user.email },
                JWT_ACCESS_SECRET,
                { expiresIn: "6h" } // New token expiration
            );

            // Generate a new refresh token
            const newRefreshToken = jwt.sign(
                { id: user.id, email: user.email },
                JWT_REFRESH_SECRET,
                { expiresIn: "7d" } // New refresh token expiration
            );

            return res.status(200).json({
                message: "Token refreshed successfully",
                access: newAccessToken,
                refresh: newRefreshToken,
                user,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error." });
    }
};
