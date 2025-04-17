import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { prisma } from "../../../prisma/index";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.PUBLIC_EMAIL,
        pass: process.env.PUBLIC_EMAIL_PASS,
    },
});

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

        if (existingUser && existingUser?.verified) {
            return res.status(400).json({ message: "User already exists", error: "User exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingUser && !existingUser?.verified) {
            const newUser = await prisma.users.update({
                where: {
                    id: existingUser?.id,
                },
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

            const refresh = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_REFRESH_SECRET, {
                expiresIn: "7d",
            });

            const info = await transporter.sendMail({
                from: `"Academy 👻" ${process.env.PUBLIC_EMAIL}`, // sender address
                to: newUser?.email || "", // list of receivers
                subject: "Email Verification", // Subject line
                text: "Email Verification", // plain text body
                html: `<a href="${process.env.WEBSITE_LINK + "verify" + "/" + refresh}">Verify Email</a>`, // html body
            });

            // Store refresh token in an HTTP-only cookie
            res.cookie("refresh", refresh, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            return res.status(200).json({ message: "Please verify email" });
        }

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

        const refresh = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_REFRESH_SECRET, {
            expiresIn: "7d",
        });

        const info = await transporter.sendMail({
            from: `"Academy 👻" ${process.env.PUBLIC_EMAIL}`, // sender address
            to: newUser?.email || "", // list of receivers
            subject: "Email Verification", // Subject line
            text: "Email Verification", // plain text body
            html: `<a href="${process.env.WEBSITE_LINK + "verify" + "/" + refresh}">Verify Email</a>`, // html body
        });

        return res.status(200).json({ message: "Please verify email" });
    } catch (error: any) {
        console.error(error);
        return res.status(400).json({ message: "Error registering user", error: error.message });
    }
};
