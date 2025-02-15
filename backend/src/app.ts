import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs, { fstat } from "fs";
import { authenticateToken } from "./middleware/authMiddleware";
import categoriesRouter from "./routes/categories";
import coursesRouter from "./routes/courses";
import { getVideoChunk } from "./controllers/files/chunks";
import filesRouter from "./routes/files";

var jsonParser = bodyParser.json();
const prisma = new PrismaClient();
const app = express();

// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json()); //  Parse JSON requests
app.use(express.urlencoded({ extended: true })); //  Parse URL-encoded requests
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["POST", "GET", "DELETE", "PATCH", "PUT"],
        credentials: true,
    })
);

app.use("/user", authRoutes);

app.use("/", filesRouter);
app.use("/user", authenticateToken, categoriesRouter);
app.use("/course", authenticateToken, coursesRouter);

app.get("/actions/secure-data", authenticateToken, (req: Request, res: Response) => {
    res.json({ message: "This is a protected route" });
});

app.use((req: Request, res: Response) => {
    res.status(405).json({
        message: `Method ${req.method} not allowed on ${req.originalUrl}`,
    });
});

// fs.access("../image", function (error) {
//   if (error) {
//     fs.mkdir(path.join(__dirname, "../image"), (err) => {
//       if (err) {
//         console.log(err);
//       }
//     });
//   }
// });

app.listen(3001, () => console.log("listening on port 3001"));
