import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";
import path from "path";
import fs from "fs";
import multer from "multer";

// Configure Multer storage for type=1 (lessons)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "image/"); // Save files to 'image' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const uploadLesson = multer({
    storage,
    limits: { fileSize: 32000 * 1024 * 1024 }, // Adjust your file size limit
}).array("files", 10); // Accept up to 10 files in the "files" field

function deleteLocalFiles(filePaths: string[]) {
    for (const filePath of filePaths) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (err) {
            console.error("Error deleting file:", filePath, err);
        }
    }
}

export const updateProgram = async (req: Request, res: Response): Promise<any> => {
    try {
        // Extract query params
        const { type, program_id } = req.query;

        if (!type || !program_id) {
            return res.status(400).json({ message: "Missing type or program_id" });
        }

        const progId = parseInt(program_id as string, 10);
        if (isNaN(progId)) {
            return res.status(400).json({ message: "Invalid program_id" });
        }

        switch (type) {
            case "1": {
                // TYPE 1: LESSON update (form-data with files)
                uploadLesson(req, res, async (uploadErr: any) => {
                    if (uploadErr) {
                        console.error("Upload error:", uploadErr);
                        return res
                            .status(500)
                            .json({ message: "File upload error", error: uploadErr });
                    }

                    try {
                        // Extract fields from form-data
                        const { name, description, remove_files } = req.body;

                        let removeFileIds: number[] = [];

                        // If remove_files is an object, it might look like: { '0': '1', '1': '2' }
                        if (typeof remove_files === "object" && remove_files !== null) {
                            // Convert object values to an array of numbers
                            removeFileIds = Object.values(remove_files).map((val) => Number(val));
                        } else if (typeof remove_files === "string") {
                            // If it's a string, attempt to parse as JSON or split by commas
                            try {
                                removeFileIds = JSON.parse(remove_files);
                                // if it was a JSON array: '["1","2"]'
                            } catch (e) {
                                // fallback: comma-separated: "1,2"
                                removeFileIds = remove_files
                                    .split(",")
                                    .map((s: string) => Number(s.trim()));
                            }
                        }

                        // Begin transaction
                        await prisma.$transaction(async (tx) => {
                            // 1. Remove files if requested
                            if (removeFileIds.length > 0) {
                                const oldFiles = await tx.programsFiles.findMany({
                                    where: { id: { in: removeFileIds }, program_id: progId },
                                });
                                const pathsToRemove = oldFiles.map((f) =>
                                    path.resolve(__dirname, "../../../image", f.file_path ?? "")
                                );
                                deleteLocalFiles(pathsToRemove);
                                await tx.programsFiles.deleteMany({
                                    where: { id: { in: removeFileIds }, program_id: progId },
                                });
                            }

                            // 2. Gather new files uploaded
                            const uploadedFiles = (req.files as Express.Multer.File[]) || [];
                            const newFilesData = uploadedFiles.map((f) => ({
                                file_name: f.filename,
                                file_path: f.filename,
                                file_type: f.mimetype,
                            }));

                            // 3. Update the program record's basic fields (for lessons, type remains 1)
                            await tx.programs.update({
                                where: { id: progId },
                                data: {
                                    name: name ?? undefined,
                                    description: description ?? undefined,
                                },
                            });

                            // 4. Insert new file records if any
                            if (newFilesData.length > 0) {
                                await tx.programsFiles.createMany({
                                    data: newFilesData.map((file) => ({
                                        ...file,
                                        program_id: progId,
                                    })),
                                });
                            }
                        });

                        // Fetch updated program (including files) to return
                        const updatedProgram = await prisma.programs.findUnique({
                            where: { id: progId },
                            include: {
                                ProgramsFiles: true,
                            },
                        });

                        if (!updatedProgram) {
                            return res
                                .status(404)
                                .json({ message: "Program not found after update" });
                        }

                        // Format response: rename ProgramsFiles to lesson
                        const responseData = {
                            id: updatedProgram.id,
                            name: updatedProgram.name,
                            order: updatedProgram.order,
                            type: updatedProgram.type,
                            lesson: updatedProgram.ProgramsFiles,
                            description: updatedProgram?.description,
                        };

                        return res.status(200).json({
                            message: "Lesson updated successfully",
                            data: responseData,
                        });
                    } catch (err: any) {
                        console.error("Error updating lesson:", err);
                        // Optionally remove any new files if error occurred
                        const newFiles = (req.files as Express.Multer.File[]).map((f) =>
                            path.resolve(__dirname, "../../../image", f.filename)
                        );
                        deleteLocalFiles(newFiles);
                        return res
                            .status(500)
                            .json({ message: "Failed to update lesson", error: err.message });
                    }
                });
                return;
            }

            case "2": {
                // Expect JSON body for type=2
                const {
                    name,
                    order,
                    passing_score,
                    reward_score,
                    questions,
                    remove_question = [],
                    remove_answer = [],
                } = req.body;

                await prisma.$transaction(async (tx) => {
                    // 2. Remove specific answers if provided
                    if (remove_answer?.length > 0) {
                        await tx.answer.deleteMany({
                            where: { id: { in: remove_answer } },
                        });
                    }

                    // 3. Remove specific questions if provided
                    if (remove_question?.length > 0) {
                        // Optionally, delete answers for these questions first if not cascade
                        await tx.answer.deleteMany({
                            where: { question_id: { in: remove_question } },
                        });
                        await tx.question.deleteMany({
                            where: { id: { in: remove_question }, program_id: progId },
                        });
                    }

                    // 4. Update the program's basic fields
                    const updatedProgram = await tx.programs.update({
                        where: { id: progId },
                        data: {
                            name: name ?? undefined,
                            order: order ? Number(order) : undefined,
                            reward_score: reward_score ? Number(reward_score) : undefined,
                            passing_score: passing_score ? Number(passing_score) : undefined,
                        },
                    });

                    // 5. Update questions and answers
                    // If "questions" array is provided, we iterate over it
                    if (questions && Array.isArray(questions)) {
                        for (const q of questions) {
                            if (q.id) {
                                // Update existing question
                                await tx.question.update({
                                    where: { id: q.id },
                                    data: {
                                        question: q.question ?? "",
                                    },
                                });
                                // Update answers for this question
                                if (q.answers && Array.isArray(q.answers)) {
                                    for (const ans of q.answers) {
                                        if (ans.id) {
                                            // Update existing answer
                                            await tx.answer.update({
                                                where: { id: ans.id },
                                                data: {
                                                    answer: ans.answer ?? "",
                                                    is_true: ans.is_true,
                                                },
                                            });
                                        } else {
                                            // Create new answer for this question
                                            await tx.answer.create({
                                                data: {
                                                    question_id: q.id,
                                                    answer: ans.answer ?? "",
                                                    is_true: ans.is_true,
                                                },
                                            });
                                        }
                                    }
                                }
                            } else {
                                // If no question id, create a new question
                                const newQuestion = await tx.question.create({
                                    data: {
                                        program_id: progId,
                                        question: q.question ?? "",
                                    },
                                });
                                if (q.answers && Array.isArray(q.answers)) {
                                    for (const ans of q.answers) {
                                        await tx.answer.create({
                                            data: {
                                                question_id: newQuestion.id,
                                                answer: ans.answer ?? "",
                                                is_true: ans.is_true,
                                            },
                                        });
                                    }
                                }
                            }
                        }
                    }
                });

                const finalProgram = await prisma.programs.findUnique({
                    where: { id: progId },
                    include: {
                        Question: {
                            include: { Answer: true },
                        },
                        ProgramsFiles: true, // if needed; otherwise, you can omit it
                    },
                });

                if (!finalProgram) {
                    return res.status(404).json({ message: "Program not found after update" });
                }

                const responseData = {
                    id: finalProgram.id,
                    name: finalProgram.name,
                    order: finalProgram.order,
                    type: finalProgram.type,
                    test: {
                        reward_score: finalProgram.reward_score,
                        passing_score: finalProgram.passing_score,
                        questions: finalProgram.Question.map((q) => ({
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

                return res.status(200).json({
                    message: "Test updated successfully",
                    data: responseData,
                });
            }
        }
    } catch (err: any) {
        console.error("Error updating program:", err);
        return res.status(500).json({ message: "Failed to update program", error: err.message });
    }
};
