import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../prisma/index";
import dotenv from "dotenv";

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: "Missing Fields", error: "Missing Fields" });
    }

    try {
        // Check if email is already registered
        const existingUser = await prisma.users.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists", error: "User exists" });
        }

        let hashedPassword;

        bcrypt
            .genSalt(10)
            .then((salt) => {
                bcrypt.hash(password, salt).then((hash) => {
                    hashedPassword = hash;
                });
            })
            .catch((err) => console.log(err));

        // Create the user in the database
        const newUser = await prisma.users.create({
            data: {
                firstname,
                lastname,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                created_at: true,
                updated_at: true,
            },
        });

        // Generate JWT Tokens
        const access = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_ACCESS_SECRET, {
            expiresIn: "6h",
        });

        const refresh = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_REFRESH_SECRET, {
            expiresIn: "7d",
        });

        // Store refresh token in an HTTP-only cookie
        res.cookie("refresh", refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            access,
            refresh,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(400).json({ message: "Error registering user", error: error.message });
    }
};
