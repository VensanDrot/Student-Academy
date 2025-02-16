import { Request, Response } from "express";
import { prisma } from "../../../prisma";
import { getDecodedToken } from "../../utils/getDecodedToken";

export const getCoursePreview = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.headers["x-access-token"] as string;
        const courseId = Number(req.query.id) || 0;

        // Get the user ID from the token
        const user_id = getDecodedToken(token);

        if (isNaN(courseId) || courseId === 0) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        // Fetch the course with its related files and programs
        const course = await prisma.courses.findUnique({
            where: { id: courseId },
            include: {
                CoursesFiles: true,
                Programs: true,
            },
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Determine if the course is considered purchased.
        // If the user is the creator (owner) of the course, mark purchased as true.
        let purchased = false;
        if (user_id && course.author === user_id) {
            purchased = true;
        } else if (user_id) {
            const purchase = await prisma.subscriptions.findFirst({
                where: {
                    user_id: user_id,
                    course_id: course.id,
                },
            });
            purchased = !!purchase;
        }

        // Calculate lesson_count and test_count.
        // Assuming Programs.type === 1 means "lesson" and type === 2 means "test"
        const lesson_count = course.Programs.filter((p) => p.type === 1).length;
        const test_count = course.Programs.filter((p) => p.type === 2).length;

        // Transform the data into your CurrentCourse shape
        const result = {
            id: course.id,
            name: course.name,
            description: course.description,
            category: course.category,
            cost: Number(course.cost), // Convert Decimal to number if needed
            purchased,
            lesson_count,
            test_count,
            course_files: course.CoursesFiles.map((file) => ({
                id: file.id,
                file_name: file.file_name,
                file_path: file.file_path,
                file_type: file.file_type,
            })),
            programs: course.Programs.map((prog) => ({
                id: prog.id,
                name: prog.name,
                type: prog.type,
                order: prog.order,
            })),
        };

        return res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching current course:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default getCoursePreview;
