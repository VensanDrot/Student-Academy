import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";
import jwt from "jsonwebtoken";
import { getDecodedToken } from "../../utils/getDecodedToken";
import { Prisma } from "@prisma/client";

const getCreatedCourses = async (req: Request, res: Response): Promise<any> => {
    const token = req.headers["x-access-token"] as string;

    const userId = getDecodedToken(token);

    if (userId === null) return res.status(404).json({ message: "User not found" });

    // Extract query parameters: search, page, items_per_page
    const { search = "", page = "1", items_per_page = "10" } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const perPage = parseInt(items_per_page as string, 10) || 10;
    const skip = (pageNum - 1) * perPage;

    const searchVariants = [] as any[];
    const searchTerms = search?.toString()?.trim()?.split(" ");
    searchTerms?.map((term: string) =>
        searchVariants.push(
            { name: { contains: term.toLowerCase(), mode: "insensitive" } },
            { description: { contains: term.toLowerCase(), mode: "insensitive" } }
        )
    );

    try {
        const where: Prisma.CoursesWhereInput = {
            OR: searchVariants,
            AND: { author: userId },
        };

        const relevanceSQL = searchTerms
            .map(
                (term: string) => `
        (CASE
          WHEN name ILIKE '%${term}%' THEN 1 ELSE 0 END) +
        (CASE
          WHEN "description" ILIKE '%${term}%' THEN 1 ELSE 0 END)`
            )
            .join(" + ");

        const rawQuery = `
      SELECT id, name, description, activated as "state", cost, "created_at",
      (${relevanceSQL}) AS relevance, (SELECT CAST(COUNT(*) AS int) FROM "Subscriptions" WHERE "Subscriptions"."course_id" = "Courses"."id") AS users, 
      (Select name from "Categories" where "Categories".id = "Courses".id ) as category,
  (
      SELECT file_name 
      FROM "CoursesFiles" 
      WHERE course_id = "Courses".id 
        AND file_type ILIKE '%image%'
      ORDER BY "created_at" ASC
      LIMIT 1
    ) AS preview
      FROM "Courses"
      WHERE author = ${userId} AND ${searchTerms
          .map(
              (term: string) => `
      (name ILIKE '%${term}%' OR "description" ILIKE '%${term}%')
    `
          )
          .join(" OR ")}
      ORDER BY ${relevanceSQL} DESC, "created_at" DESC
      LIMIT ${perPage} OFFSET ${skip}
    `;

        // console.log(rawQuery);

        const response = await prisma.$transaction([
            prisma.courses.count({
                where,
            }),
            prisma.$queryRawUnsafe(rawQuery),
        ]);

        return res.status(200).json({
            data: response[1],
            pages: Math.ceil(response[0] / Number(items_per_page)),
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};

export default getCreatedCourses;
