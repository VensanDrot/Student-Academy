import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";
import multer from "multer";
import path from "path";

// Configure Multer inside the endpoint
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "image/"); // Save to 'image' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 32000 * 1024 * 1024 }, // 5MB limit
}).array("files", 10); // Accepts multiple files

export const createCourse = async (req: Request, res: Response) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload error", error: err.message });
        }

        try {
            const { name, description, cost, category, activated } = req.body;

            if (!name || !description || !cost || !category || !req.files) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // Convert cost to number
            const costNumber = parseFloat(cost);
            if (isNaN(costNumber)) {
                return res.status(400).json({ message: "Invalid cost value" });
            }

            // Process uploaded files
            const files = (req.files as Express.Multer.File[]).map((file) => ({
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
            }));

            // Save record in database
            const newCourse = await prisma.courses.create({
                data: {
                    name,
                    description,
                    cost,
                    category: category ? parseInt(category) : null, // Foreign key
                    activated: activated === "true" ? true : false,
                    CoursesFiles: {
                        create: files.map((file) => ({
                            file_name: file.filename,
                            file_path: file.filename,
                            file_type: file.mimetype,
                        })),
                    },
                },
                include: {
                    CoursesFiles: true, //  Fetch related files after creation
                },
            });

            //  Rename `CoursesFiles` to `course_file` before sending response
            const formattedCourse = {
                ...newCourse,
                course_files: newCourse?.CoursesFiles,
            };

            return res.status(201).json({
                message: "Files uploaded successfully",
                data: formattedCourse,
                files,
            });
        } catch (error) {
            console.error("Error uploading files:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
};
