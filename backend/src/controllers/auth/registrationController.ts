import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../prisma/index";
import dotenv from "dotenv";
import { transporter } from "../../utils/transporter"; // Handlebars‑enabled transporter
import { compileTemplate } from "../../utils/compileTemplate";

dotenv.config();

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const FRONTEND_URL = process.env.WEBSITE_LINK!;
const LOGO_URL = process.env.LOGO_URL || ""; // optional

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        // 1) Check for existing user
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser && existingUser.verified) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2) Hash incoming password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3) Create or update (unverified) user
        const user = existingUser
            ? await prisma.users.update({
                  where: { id: existingUser.id },
                  data: { firstname, lastname, password: hashedPassword },
              })
            : await prisma.users.create({
                  data: { firstname, lastname, email, password: hashedPassword },
              });

        const verifyToken = jwt.sign({ id: user.id, email: user.email }, JWT_REFRESH_SECRET, {
            expiresIn: "7d",
        });

        const verifyLink = `${FRONTEND_URL}/verify/${verifyToken}`;

        // 3) Compile your Handlebars template to HTML
        const html = compileTemplate("verify-email", {
            firstname: user.firstname,
            verifyLink,
            logoUrl: LOGO_URL,
            // unsubscribeLink: `${FRONTEND_URL}/unsubscribe`,
        });

        // 4) Send the email with the generated HTML
        await transporter.sendMail({
            from: `"ADV Academy" <${process.env.PUBLIC_EMAIL}>`,
            to: user.email || "",
            subject: "Verify Your Email Address",
            html, // <-- your compiled template
        });

        return res
            .status(200)
            .json({ message: "Registration successful! Verification email sent." });
    } catch (err: any) {
        console.error("registerUser error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
