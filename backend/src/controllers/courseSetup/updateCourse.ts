import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { prisma } from "../../../prisma/index";
import multer from "multer";
import jwt from "jsonwebtoken";

// Configure Multer for new file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "image/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage }).array("files", 10);

export const updateCourse = async (req: Request, res: Response) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload error", error: err.message });
        }

        const token = req.headers["x-access-token"] as string;
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
            if (!decoded.id) return res.status(401).json({ message: "Invalid token" });
        } catch (error) {
            return res.status(401).json({ message: "Invalid token", error });
        }
        const userId = decoded.id;

        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "Missing course ID" });

            const courseId = parseInt(id, 10);
            if (isNaN(courseId)) return res.status(400).json({ message: "Invalid course ID" });

            // Extract fields to update
            const { name, description, cost, category, remove_files, activated } = req.body;

            // Ensure `remove_files` is an array
            let filesToRemove = remove_files;
            if (typeof remove_files === "string") {
                filesToRemove = [remove_files];
            }

            // Find existing course
            const course = await prisma.courses.findUnique({
                where: { id: courseId },
                include: { CoursesFiles: true },
            });

            if (course?.author !== userId)
                return res.status(401).json({ message: "You have no permission to edit" });

            if (!course) return res.status(404).json({ message: "Course not found" });

            // Handle file deletions
            if (filesToRemove && Array.isArray(filesToRemove)) {
                for (const fileId of filesToRemove) {
                    const file = await prisma.coursesFiles.findUnique({
                        where: { id: parseInt(fileId) },
                    });

                    if (file) {
                        const filePath = path.resolve(
                            __dirname,
                            "../../../image",
                            file.file_path || ""
                        );
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

                        await prisma.coursesFiles.delete({ where: { id: file.id } });
                    }
                }
            }

            // Handle new file uploads
            const uploadedFiles = (req.files as Express.Multer.File[]) || [];
            const newFilesData = uploadedFiles.map((file) => ({
                file_name: file.filename,
                file_path: file.filename,
                file_type: file.mimetype,
                course_id: courseId,
            }));

            // Save new files in DB
            if (newFilesData.length > 0) {
                await prisma.coursesFiles.createMany({ data: newFilesData });
            }

            // Update course fields
            const updatedCourse = await prisma.courses.update({
                where: { id: courseId },
                data: {
                    name: name || undefined,
                    description: description || undefined,
                    cost: cost ? parseFloat(cost) : undefined,
                    category: category ? parseInt(category) : undefined,
                    activated: activated ? (activated === "true" ? true : false) : undefined,
                },
                include: { CoursesFiles: true },
            });

            // Rename property for frontend response
            const formattedCourse = {
                ...updatedCourse,
                course_files: updatedCourse?.CoursesFiles,
            };
            const { CoursesFiles, ...filteredCourse } = formattedCourse;

            return res.status(200).json({
                message: "Course updated successfully",
                data: filteredCourse,
            });
        } catch (error) {
            console.error("Error updating course:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
};
