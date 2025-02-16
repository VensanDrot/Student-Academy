import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { authenticateToken } from "./middleware/authMiddleware";
import categoriesRouter from "./routes/categories";
import coursesRouter from "./routes/courses";
import filesRouter from "./routes/files";
import paymentRouter from "./routes/payments";
import programRoutes from "./routes/programs";

const imageDir = path.join(__dirname, "../image");

// Check if image/ folder exists, if not create it
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
    console.log("Created folder:", imageDir);
}

const app = express();

// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json()); //  Parse JSON requests
app.use(express.urlencoded({ extended: true })); //  Parse URL-encoded requests
app.use(
    cors({
        origin: "*",
        methods: ["POST", "GET", "DELETE", "PATCH", "PUT"],
        credentials: true,
    })
);

app.use("/users", authRoutes);

app.use("/", filesRouter);
app.use("/course", authenticateToken, coursesRouter);
app.use("/user", authenticateToken, categoriesRouter);
app.use("/payments", authenticateToken, paymentRouter);
app.use("/programs", authenticateToken, programRoutes);

app.get("/actions/secure-data", authenticateToken, (req: Request, res: Response) => {
    res.json({ message: "This is a protected route" });
});

app.use((req: Request, res: Response) => {
    res.status(405).json({
        message: `Method ${req.method} not allowed on ${req.originalUrl}`,
    });
});

app.listen(3001, () => console.log("listening on port 3001"));
