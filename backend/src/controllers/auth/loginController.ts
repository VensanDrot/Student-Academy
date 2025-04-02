import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../prisma/index";
import dotenv from "dotenv";

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    const { email, password, remember_me } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: "Missing Fields", error: "Missing Fields" });

    try {
        // Check if secrets are available
        if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET)
            return res.status(500).json({ message: "Server error: JWT secret missing" });

        // Check if the user exists using email
        const user = await prisma.users.findFirst({
            where: { email, verified: true },
            select: {
                email: true,
                firstname: true,
                lastname: true,
                id: true,
                password: true,
                verified: true,
            },
        });

        if (!user || !user?.password) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        // if user is not verified
        if (!user?.verified) {
            return res.status(403).json({ message: "Account is not verified" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate Access Token (Short-lived)
        const access = jwt.sign(
            { id: user.id, email: user.email },
            JWT_ACCESS_SECRET,
            { expiresIn: "6h" } // Access token expires in 6 hours
        );

        let refresh = null;

        if (remember_me) {
            // Generate Refresh Token (Longer-lived) only if `rememberMe` is true
            refresh = jwt.sign(
                { id: user.id, email: user.email },
                JWT_REFRESH_SECRET,
                { expiresIn: "7d" } // Refresh token expires in 8 days
            );

            // Store refresh token in an HTTP-only cookie
            res.cookie("refreshToken", refresh, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 8 days
            });
        }

        return res.status(200).json({
            message: "Login successful",
            access,
            refresh,
            user: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                id: user.id,
            },
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};
