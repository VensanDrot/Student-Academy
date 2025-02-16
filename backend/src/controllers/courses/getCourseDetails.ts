import { Request, Response } from "express";
import { prisma } from "../../../prisma"; // adjust path to your prisma instance

export const getClientCourseDetails = async (req: Request, res: Response): Promise<any> => {
    try {
        const courseId = parseInt(req.query.id as string, 10);
        if (isNaN(courseId)) {
            return res.status(400).json({ message: "Invalid or missing course ID" });
        }

        // 1) Fetch the course and its programs
        const course = await prisma.courses.findUnique({
            where: { id: courseId },
            include: {
                Programs: {
                    select: {
                        id: true,
                        name: true,
                        order: true,
                        type: true,
                        time: true,
                        ProgramsFiles: {
                            select: {
                                file_path: true,
                            },
                            where: {
                                file_type: {
                                    contains: "image",
                                    mode: "insensitive",
                                },
                            },
                        },
                    },
                    orderBy: {
                        order: "asc",
                    },
                },
            },
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // 2) Count how many are lessons (type=1) and tests (type=2)
        const lessonsTotal = course.Programs.filter((p) => p.type === 1).length;
        const testsTotal = course.Programs.filter((p) => p.type === 2).length;

        // 3) Transform each program to match CourseDetailProgram
        const programs = course.Programs.map((p) => {
            return {
                id: p.id,
                name: p.name ?? "",
                order: p.order ?? 0,
                preview: p?.ProgramsFiles[0]?.file_path,
                type: p.type ?? 0,
            };
        });

        // 4) Build the final response
        const responseData = {
            programs,
            course: {
                id: course.id,
                lessons_total: lessonsTotal,
                name: course.name ?? "",
                tests_total: testsTotal,
            },
        };

        return res.status(200).json(responseData);
    } catch (error: any) {
        console.error("Error fetching course details:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
