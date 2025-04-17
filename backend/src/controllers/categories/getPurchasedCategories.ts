import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";
import { getDecodedToken } from "../../utils/getDecodedToken";

export const getPurchasedCounted = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.headers["x-access-token"] as string;
        const user_id = getDecodedToken(token);
        if (!user_id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const rawQuery = `
            SELECT *
            FROM (
              SELECT
                cat.id,
                cat.name,
                (
                  SELECT CAST(COUNT(*) AS int)
                  FROM "Courses" co
                  WHERE co.category = cat.id
                    AND co.approved = true
                    AND (
                      co.author = ${user_id}
                      OR co.id IN (
                        SELECT s."course_id"
                        FROM "Subscriptions" s
                        WHERE s."user_id" = ${user_id}
                      )
                    )
                ) AS count
              FROM "Categories" cat
            ) AS sub
            WHERE sub.count > 0
        `;

        const totalQuery = `
            SELECT CAST(COUNT(*) AS int) AS total
            FROM "Courses" co
            WHERE co.approved = true
              AND (
                co.author = ${user_id}
                OR co.id IN (
                  SELECT s."course_id"
                  FROM "Subscriptions" s
                  WHERE s."user_id" = ${user_id}
                )
              )
        `;

        const [categoriesResult, totalResult]: any[] = await prisma.$transaction([
            prisma.$queryRawUnsafe(rawQuery),
            prisma.$queryRawUnsafe(totalQuery),
        ]);

        const totalCount = totalResult?.[0]?.total ?? 0;

        return res.status(200).json({
            message: "Success",
            jobs: categoriesResult,
            total_count: totalCount,
        });
    } catch (error: any) {
        console.error("Error in getPurchasedCounted:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
