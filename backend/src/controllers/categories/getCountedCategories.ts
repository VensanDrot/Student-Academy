import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";

export const getCategoriesCounted = async (req: Request, res: Response): Promise<any> => {
    try {
        const rawQuery = `
        SELECT *
        FROM (
            SELECT 
                c.id, 
                c.name, 
                (SELECT CAST(COUNT(*) AS int) 
                 FROM "Courses" 
                 WHERE "Courses".category = c.id AND "Courses".approved = true) AS count
            FROM "Categories" c
        ) AS sub
        WHERE sub.count > 0;
        `;

        const response = await prisma.$transaction([
            prisma.$queryRawUnsafe(rawQuery),
            prisma.courses.count({ where: { approved: true } }),
        ]);

        return res
            .status(200)
            .json({ message: "Success", jobs: response[0], total_count: response[1] });
    } catch (error: any) {
        console.error("Error refreshing token:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
