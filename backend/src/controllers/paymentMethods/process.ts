import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";
import { getDecodedToken } from "../../utils/getDecodedToken";
import { Prisma } from "@prisma/client";

const processPayment = async (req: Request, res: Response): Promise<any> => {
    const { course_id, card_id } = req.body;
    const token = req.headers["x-access-token"] as string;

    const user_id = getDecodedToken(token);

    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    if (!course_id || !card_id || isNaN(course_id) || isNaN(card_id))
        return res.status(400).json({ message: "Missing Fields" });

    try {
        const course = await prisma.courses.findFirst({
            where: {
                id: Number(course_id),
            },
            select: {
                cost: true,
                author: true,
                id: true,
            },
        });

        const user = await prisma.users.findFirst({
            where: {
                id: user_id,
            },
            select: {
                balance: true,
                id: true,
            },
        });

        if (!user || !course)
            return res.status(400).json({ message: "Can't find selected course" });

        if (course?.cost === 0) {
            const subscription = await prisma.subscriptions.create({
                data: {
                    amount_paid: 0,
                    course_price: 0,
                    course_id: Number(course_id),
                    user_id: user_id,
                },
            });

            return res
                .status(200)
                .json({ message: "Course purchased successfully", details: subscription });
        }

        const queries: Prisma.PrismaPromise<any>[] = [
            prisma.subscriptions.create({
                data: {
                    amount_paid: course?.cost,
                    course_price: course?.cost,
                    course_id: Number(course_id),
                    user_id: user_id,
                },
            }),
            prisma.users.update({
                data: {
                    balance: { increment: Number(course?.cost) },
                },
                where: {
                    id: Number(course?.author),
                },
            }),
        ];

        if (card_id === "-1") {
            queries.push(
                prisma.users.update({
                    data: {
                        balance: { decrement: Number(course?.cost) },
                    },
                    where: {
                        id: user?.id,
                    },
                })
            );
        }

        if (Number(course?.cost) > Number(user?.balance)) {
            return res.status(400).json({ message: "Not enough money" });
        }

        const subscription = await prisma.$transaction(queries);

        return res
            .status(200)
            .json({ message: "Course purchased successfully", details: subscription[0] });
    } catch (error) {
        console.error("Error uploading files:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default processPayment;
