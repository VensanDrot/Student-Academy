import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";
import multer from "multer";
import jwt from "jsonwebtoken";
import fs from "fs";

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
}).array("lesson", 10); // Accepts multiple files

function deleteUploadedFiles(files: Express.Multer.File[]) {
    for (const file of files) {
        try {
            fs.unlinkSync(file.path);
        } catch (unlinkError) {
            console.error("Error deleting file:", file.path, unlinkError);
        }
    }
}

export const createProgram = async (req: Request, res: Response): Promise<any> => {
    const { type, course_id } = req.query;

    if (!type || !course_id || isNaN(Number(course_id))) {
        return res.status(404).json({ message: "Missing type or course_id" });
    }

    switch (type) {
        //case 1 is lesson
        case "1": {
            upload(req, res, async (uploadErr: any) => {
                const { order, description, name } = req.body;

                if (uploadErr) {
                    console.error("Upload error:", uploadErr);
                    return res.status(500).json({ message: "File upload error", error: uploadErr });
                }

                if (!name || !description || !order) {
                    console.log(name, description, order);
                    return res.status(400).json({ message: "Missing required lesson fields" });
                }

                const files = (req.files as Express.Multer.File[]).map((file) => ({
                    filename: file.filename,
                    path: file.path,
                    mimetype: file.mimetype,
                }));

                const newProgram = await prisma.programs.create({
                    data: {
                        name,
                        description,
                        course_id: Number(course_id),
                        order: Number(order),
                        type: 1,
                        ProgramsFiles: {
                            create: files.map((file) => ({
                                file_name: file.filename,
                                file_path: file.filename,
                                file_type: file.mimetype,
                            })),
                        },
                    },
                    select: {
                        name: true,
                        description: true,
                        order: true,
                        id: true,
                        type: true,
                        ProgramsFiles: {
                            select: {
                                file_name: true,
                                file_path: true,
                                file_type: true,
                                id: true,
                            },
                        },
                    },
                });

                const formattedCourse = {
                    ...newProgram,
                    lesson: newProgram?.ProgramsFiles,
                };

                const { ProgramsFiles, ...program } = formattedCourse;

                return res.status(201).json({
                    message: "Lesson created successfully",
                    data: program,
                });
            });

            return; // or break;
        }

        case "2": {
            try {
                const { name, order, passing_score, reward_score, questions } = req.body;

                if (!name || !Array.isArray(questions)) {
                    return res
                        .status(400)
                        .json({ message: "Missing required test fields (name, questions)" });
                }

                // Create the test program
                const newProgram = await prisma.programs.create({
                    data: {
                        name,
                        course_id: Number(course_id),
                        order: order ? Number(order) : undefined,
                        type: 2,
                        reward_score: reward_score ? Number(reward_score) : undefined,
                        passing_score: passing_score ? Number(passing_score) : undefined,
                        Question: {
                            create: questions?.map((question) => ({
                                question: question?.question,
                                Answer: {
                                    create: question?.answers?.map((answer: any) => ({
                                        answer: answer?.answer,
                                        is_true: answer?.is_true === "true" ? true : false,
                                    })),
                                },
                            })),
                        },
                    },
                    include: {
                        Question: {
                            select: {
                                id: true,
                                question: true,
                                Answer: true,
                            },
                        },
                    },
                });

                const responseData = {
                    id: newProgram.id,
                    name: newProgram?.name,
                    order: newProgram?.order,
                    type: newProgram?.type,
                    test: {
                        reward_score: newProgram.reward_score,
                        passing_score: newProgram.passing_score,
                        questions: newProgram.Question.map((q) => ({
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

                console.log(responseData);

                return res.status(201).json({
                    message: "Test created successfully",
                    data: responseData,
                });
            } catch (err: any) {
                console.error("Error creating test:", err);
                return res
                    .status(500)
                    .json({ message: "Failed to create test", error: err.message });
            }
        }

        default:
            return res.status(404).json({ message: "Unknown type" });
    }
};
