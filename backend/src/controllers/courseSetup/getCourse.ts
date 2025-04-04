import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";

export const getCourse = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.query; //Extract id from query params

        if (!id) {
            return res.status(400).json({ message: "Missing course ID" });
        }

        const course = await prisma.courses.findFirst({
            where: {
                id: parseInt(id as string),
            },
            include: {
                CoursesFiles: true,
                Programs: {
                    select: {
                        type: true,
                        order: true,
                        id: true,
                        description: true,
                        name: true,
                        reward_score: true,
                        passing_score: true,
                        ProgramsFiles: {
                            select: {
                                file_name: true,
                                file_path: true,
                                file_type: true,
                                id: true,
                            },
                        },
                        Question: {
                            select: {
                                id: true,
                                question: true,
                                Answer: {
                                    select: {
                                        id: true,
                                        answer: true,
                                        is_true: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: { order: "asc" },
                },
            },
        });

        const formattedCourse = {
            ...course,
            course_files: course?.CoursesFiles,
            programs: course?.Programs.map((program) => {
                if (program?.type === 1) {
                    const { ProgramsFiles, ...rest } = program;
                    return {
                        ...rest,
                        lesson: ProgramsFiles,
                    };
                } else {
                    const { reward_score, passing_score, Question, ...rest } = program;
                    return {
                        ...rest,
                        test: {
                            reward_score,
                            passing_score,
                            questions: Question.map((q) => ({
                                id: q.id,
                                question: q.question,
                                answers: q.Answer.map((ans) => ({
                                    id: ans.id,
                                    answer: ans.answer,
                                    is_true: ans.is_true,
                                })),
                            })),
                        },
                    };
                }
            }),
        };

        delete formattedCourse.CoursesFiles;
        delete formattedCourse.Programs;

        return res.status(200).json({ message: "Success", data: formattedCourse });
    } catch (error: any) {
        console.error("Error refreshing token:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
