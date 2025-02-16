import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";
import jwt from "jsonwebtoken";
import { getDecodedToken } from "../../utils/getDecodedToken";

export const checkAnswers = async (req: Request, res: Response): Promise<any> => {
    try {
        // 1) Decode user from x-access-token
        const token = req.headers["x-access-token"] as string;

        const user_id = getDecodedToken(token);

        if (!user_id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        // 2) Parse prog_id (the test ID) and questions from request body
        const { prog_id, questions } = req.body;
        if (!prog_id || !Array.isArray(questions)) {
            return res.status(400).json({ message: "Missing 'prog_id' or 'questions' array" });
        }

        const programId = Number(prog_id);
        if (isNaN(programId)) {
            return res.status(400).json({ message: "Invalid prog_id" });
        }

        // 3) Fetch the test program (type=2) with its questions and answers
        const testProgram = await prisma.programs.findUnique({
            where: { id: programId },
            include: {
                Question: {
                    select: {
                        id: true,
                        Answer: {
                            select: {
                                id: true,
                                is_true: true,
                            },
                        }, // fetch all answers
                    },
                },
            },
        });

        if (!testProgram) {
            return res.status(404).json({ message: "Test not found" });
        }
        if (testProgram.type !== 2) {
            return res.status(400).json({ message: "Program is not a test (type=2)" });
        }

        // You can define how many points to give for each correct answer
        // For example, if testProgram.reward_score is the total for the entire test,
        // you might distribute it among all correct answers. For simplicity, let's do +1 per correct answer.
        const pointsPerCorrect = testProgram?.reward_score || 1;

        const max_score = testProgram?.Question?.length * (testProgram?.reward_score || 1);
        let userScore = 0;

        questions?.forEach((question) => {
            const ques = testProgram?.Question?.find((q) => q?.id === question?.id && q);

            question?.answers?.forEach((answer: any) => {
                const an = ques?.Answer?.find((an) => an?.id === answer && an);

                if (an?.is_true) userScore = userScore + pointsPerCorrect;
                else userScore = userScore - 2;
            });
        });

        if (userScore < 0) userScore = 0;

        const existingResult = await prisma.testResults.findFirst({
            where: {
                user_id: user_id,
                test_id: programId,
            },
        });

        if (existingResult) {
            // Update existing
            await prisma.testResults.update({
                where: { id: existingResult.id },
                data: { result: userScore },
            });
        } else {
            // Create new
            await prisma.testResults.create({
                data: {
                    user_id: user_id,
                    test_id: programId,
                    result: userScore,
                },
            });
        }

        // 7) Return final data
        const passingScore = testProgram.passing_score ?? 0;
        const passed = userScore >= passingScore;

        return res.status(200).json({
            message: "Answers checked successfully",
            user_score: userScore,
            passing_score: passingScore,
            max_score,
            passed,
        });
    } catch (err: any) {
        console.error("Error checking answers:", err);
        return res.status(500).json({
            message: "Failed to check answers",
            error: err.message,
        });
    }
};
