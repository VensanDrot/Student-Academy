import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    // Get token from the "access" header
    const token = req.headers["x-access-token"] as string;

    if (!token) {
        res.status(401).json({ message: "Unauthorized: No access token provided" });
        return;
    }

    jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            res.status(403).json({ message: "Forbidden: Invalid access token" });
            return;
        }

        (req as any).user = user;
        next(); // ✅ Call next() properly
    });
};
