import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { prisma } from "../../../prisma/index";
import jwt from "jsonwebtoken";

export const deleteCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params; // Extract course ID from params
        if (!id) {
            return res.status(400).json({ message: "Missing course ID" });
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

        const courseId = parseInt(id, 10);
        if (isNaN(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        // Fetch course along with its associated files
        const course = await prisma.courses.findUnique({
            where: { id: courseId },
            include: { CoursesFiles: true },
        });

        if (course?.author !== userId)
            return res.status(401).json({ message: "You have no permission to edit" });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        //  Delete associated files from disk
        if (course.CoursesFiles.length > 0) {
            course.CoursesFiles.forEach((file) => {
                const filePath = path.resolve(__dirname, "../../../image", file.file_path || "");
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Delete file from disk
                }
            });
        }

        // Delete files from database
        await prisma.coursesFiles.deleteMany({
            where: { course_id: courseId },
        });

        // Delete course from database
        await prisma.courses.delete({
            where: { id: courseId },
        });

        return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting course:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
