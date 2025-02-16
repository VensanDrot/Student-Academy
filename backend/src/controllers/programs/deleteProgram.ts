import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { prisma } from "../../../prisma"; // adjust path to your prisma instance

export const deleteProgram = async (req: Request, res: Response): Promise<any> => {
    try {
        // 1. Get programId from params (or query)
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Missing program ID" });
        }
        const programId = parseInt(id, 10);
        if (isNaN(programId)) {
            return res.status(400).json({ message: "Invalid program ID" });
        }

        // 2. Fetch the program with files, questions, and answers
        const program = await prisma.programs.findUnique({
            where: { id: programId },
            include: {
                ProgramsFiles: true,
                Question: {
                    include: {
                        Answer: true,
                    },
                },
            },
        });

        if (!program) {
            return res.status(404).json({ message: "Program not found" });
        }

        // 3. Start a transaction to remove all references
        await prisma.$transaction(async (tx) => {
            // a) Collect question IDs
            const questionIds = program.Question.map((q) => q.id);

            // b) Delete answers for those questions
            if (questionIds.length > 0) {
                await tx.answer.deleteMany({
                    where: {
                        question_id: { in: questionIds },
                    },
                });
            }

            // c) Delete questions
            await tx.question.deleteMany({
                where: {
                    program_id: programId,
                },
            });

            // d) Delete program files
            await tx.programsFiles.deleteMany({
                where: { program_id: programId },
            });

            // e) Finally, delete the program
            await tx.programs.delete({
                where: { id: programId },
            });
        });

        // 4. Remove actual files from disk
        //    - Program files
        if (program.ProgramsFiles && program.ProgramsFiles.length > 0) {
            program.ProgramsFiles.forEach((file) => {
                const filePath = path.resolve(__dirname, "../../../image", file.file_path || "");
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        return res.status(200).json({ message: "Program deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting program:", error);
        return res.status(500).json({
            message: "Could not delete program",
            error: error.message,
        });
    }
};
