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

        // Validate token & get userId
        const token = req.headers["x-access-token"] as string;
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
            if (!decoded.id) return res.status(401).json({ message: "Invalid token" });
        } catch (error) {
            return res.status(401).json({ message: "Invalid token", error });
        }
        const userId = decoded.id;

        // Parse the courseId
        const courseId = parseInt(id, 10);
        if (isNaN(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        // Fetch the course with its files (so we can remove them from disk later)
        const course = await prisma.courses.findUnique({
            where: { id: courseId },
            include: {
                CoursesFiles: true,
            },
        });

        // If course not found
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if user is author
        if (course.author !== userId) {
            return res
                .status(403)
                .json({ message: "You have no permission to delete this course" });
        }

        // Fetch all programs for the course (with their files)
        const programs = await prisma.programs.findMany({
            where: { course_id: courseId },
            select: {
                id: true,
                ProgramsFiles: true,
            },
        });

        // Wrap deletions in a transaction
        await prisma.$transaction(async (tx) => {
            // 1. Collect all program IDs
            const programIds = programs.map((p) => p.id);

            // 2. Delete program files for those programs
            if (programIds.length > 0) {
                await tx.programsFiles.deleteMany({
                    where: { program_id: { in: programIds } },
                });
            }

            // 3. Delete the programs themselves
            await tx.programs.deleteMany({
                where: { course_id: courseId },
            });

            // 4. Delete course files (the rows in the DB)
            await tx.coursesFiles.deleteMany({
                where: { course_id: courseId },
            });

            // 5. Finally, delete the course
            await tx.courses.delete({
                where: { id: courseId },
            });
        });

        // A) Delete course files from disk
        if (course.CoursesFiles && course.CoursesFiles.length > 0) {
            course.CoursesFiles.forEach((file) => {
                const filePath = path.resolve(__dirname, "../../../image", file.file_path || "");
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        // B) Delete program files from disk
        for (const program of programs) {
            if (program.ProgramsFiles && program.ProgramsFiles.length > 0) {
                program.ProgramsFiles.forEach((file) => {
                    const filePath = path.resolve(
                        __dirname,
                        "../../../image",
                        file.file_path || ""
                    );
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }
        }

        return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting course:", error);
        return res.status(500).json({
            message: "Course could not be deleted (perhaps it was purchased)",
            error: error.message,
        });
    }
};
