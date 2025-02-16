import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";

export const getClientLessonFull = async (req: Request, res: Response): Promise<any> => {
    try {
        // 1) Parse the lesson/program ID from query
        const lessonId = parseInt(req.query.id as string, 10);
        if (isNaN(lessonId)) {
            return res.status(400).json({ message: "Invalid or missing lesson ID" });
        }

        // 2) Fetch the current lesson (program) with its files
        const currentLesson = await prisma.programs.findUnique({
            where: { id: lessonId },
            include: {
                ProgramsFiles: {
                    select: {
                        id: true,
                        file_type: true,
                        file_path: true,
                    },
                },
            },
        });

        if (!currentLesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        // Prepare defaults for next/prev data
        let next_id = 0;
        let next_name = "";
        let next_type = 0;
        let prev_id = 0;
        let prev_name = "";
        let prev_type = 0;

        // If currentLesson.order is null, skip fetching next/prev.
        // Otherwise, find the previous and next lessons within the same course (type=1).
        if (currentLesson.order != null) {
            // 3) Find the previous lesson
            const prevLesson = await prisma.programs.findFirst({
                where: {
                    course_id: currentLesson.course_id,
                    order: { lt: currentLesson.order },
                },
                orderBy: { order: "desc" },
            });

            // 4) Find the next lesson
            const nextLesson = await prisma.programs.findFirst({
                where: {
                    course_id: currentLesson.course_id,
                    order: { gt: currentLesson.order },
                },
                orderBy: { order: "asc" },
            });

            if (prevLesson) {
                prev_id = prevLesson.id;
                prev_name = prevLesson.name ?? "";
                prev_type = prevLesson.type ?? 0;
            }
            if (nextLesson) {
                next_id = nextLesson.id;
                next_name = nextLesson.name ?? "";
                next_type = nextLesson.type ?? 0;
            }
        }

        // 5) Build the response object
        const responseData = {
            name: currentLesson.name || "",
            description: currentLesson.description || "",
            lesson_files: currentLesson.ProgramsFiles.map((file) => ({
                id: file.id,
                file_type: file.file_type || "",
                file_path: file.file_path || "",
            })),
            next_id,
            next_name,
            next_type,
            prev_id,
            prev_name,
            prev_type,
        };

        return res.status(200).json(responseData);
    } catch (error: any) {
        console.error("Error fetching lesson details:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
