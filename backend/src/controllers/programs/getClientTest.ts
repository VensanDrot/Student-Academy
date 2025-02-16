import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";
import jwt from "jsonwebtoken";

// GET /user/test?test_id=123
export const getClientTestFull = async (req: Request, res: Response): Promise<any> => {
    try {
        // Parse test_id from query
        const testId = parseInt(req.query.test_id as string, 10);
        if (isNaN(testId)) {
            return res.status(400).json({ message: "Invalid or missing test_id" });
        }

        // Optionally, decode the user from token to fetch user score
        // (Assuming you have a JWT token and a secret, adjust as needed)
        const token = req.headers["x-access-token"] as string;
        let userId: number | null = null;
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
            userId = decoded.id;
        } catch (err) {
            console.warn("Token not provided or invalid. User score will not be included.");
        }

        // Fetch the test program with its questions and answers
        const testProgram = await prisma.programs.findUnique({
            where: { id: testId },
            include: {
                Question: {
                    include: {
                        Answer: true,
                    },
                },
            },
        });

        if (!testProgram) {
            return res.status(404).json({ message: "Test not found" });
        }

        // (Optional) Verify this program is actually a test, e.g. type = 2.
        if (testProgram.type !== 2) {
            return res.status(400).json({ message: "Requested program is not a test" });
        }

        // Fetch the user's test result, if userId is available
        let userScore: number | undefined = undefined;
        if (userId) {
            const testResult = await prisma.testResults.findFirst({
                where: {
                    user_id: userId,
                    test_id: testId,
                },
            });
            if (testResult) {
                userScore = testResult.result || 0;
            }
        }

        // Build the response to match ClientTestFull interface
        const responseData = {
            id: testProgram.id,
            questions: testProgram.Question.map((q) => ({
                id: q.id,
                question: q.question || "",
                answers: q.Answer.map((ans) => ({
                    id: ans.id,
                    answer: ans.answer || "",
                })),
            })),
            max_score: testProgram.reward_score ?? 0,
            passing_score: testProgram.passing_score ?? 0,
            user_score: userScore,
        };

        return res.status(200).json(responseData);
    } catch (error: any) {
        console.error("Error fetching test details:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
