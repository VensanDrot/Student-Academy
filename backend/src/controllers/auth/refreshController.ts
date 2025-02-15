import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../../prisma/index";
import dotenv from "dotenv";

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    try {
        // Get refresh token from headers
        const refreshToken = req.headers["refresh"] as string;

        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized: No refresh token provided" });
        }

        // Verify the refresh token
        jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, decoded: any) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden: Invalid refresh token" });
            }

            // Check if user still exists
            const user = await prisma.users.findUnique({
                where: { id: decoded.id },
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
    } catch (error: any) {
        console.error("Error refreshing token:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
