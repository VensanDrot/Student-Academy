import { Request, response, Response } from "express";
import { prisma } from "../../../prisma/index";
import { getDecodedToken } from "../../utils/getDecodedToken";
import { Prisma } from "@prisma/client";

export const getPaymentMethods = async (req: Request, res: Response): Promise<any> => {
    const token = req.headers["x-access-token"] as string;
    const user_id = getDecodedToken(token);

    if (!user_id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if a course_id query parameter was provided
    const course_id = req.query.course_id ? Number(req.query.course_id) : null;

    try {
        const queries: Prisma.PrismaPromise<any>[] = [
            // a) Payment Methods
            prisma.paymentMethods.findMany({
                where: { user_id },
                select: {
                    card_number: true,
                    exparation: true,
                    type: true,
                    id: true,
                },
            }),
            // b) User's Balance
            prisma.users.findFirst({
                where: { id: user_id },
                select: { balance: true },
            }),
        ];

        // 4. If we have a course_id, push another query
        if (course_id) {
            queries.push(
                prisma.courses.findFirst({
                    where: { id: course_id },
                    select: { cost: true },
                })
            );
        }

        const paymentMethods = await prisma.$transaction(queries);

        // Transform to only return last 4 digits of card_number
        const safePaymentMethods = paymentMethods[0].map((method: any) => ({
            ...method,
            card_number: method?.card_number?.slice(-4),
        }));

        const obj = paymentMethods[2] ? { price: paymentMethods[2]?.cost } : {};

        return res.status(200).json({
            message: "Success",
            data: safePaymentMethods,
            balance: paymentMethods[1]?.balance,
            ...obj,
        });
    } catch (error: any) {
        console.error("Error fetching payment methods:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
