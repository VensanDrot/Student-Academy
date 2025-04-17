import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// A plain Nodemailer transporter—no ESM plugins here.
export const transporter = nodemailer.createTransport({
    service: "gmail", // or your SMTP host
    secure: true, // true if you use port 465
    auth: {
        user: process.env.PUBLIC_EMAIL,
        pass: process.env.PUBLIC_EMAIL_PASS,
    },
});
