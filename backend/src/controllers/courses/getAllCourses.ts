import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";
import { getDecodedToken } from "../../utils/getDecodedToken";
import { Prisma } from "@prisma/client";

const getAllCourses = async (req: Request, res: Response): Promise<any> => {
    const token = req.headers["x-access-token"] as string;

    const user_id = getDecodedToken(token);

    // Extract query parameters: search, page, items_per_page
    const { search = "", cat_id, page = "1", items_per_page = "10" } = req.query;
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
            ...(cat_id ? { AND: { category: { equals: Number(cat_id) } } } : {}),
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
      SELECT 
  c.id, 
  c.name, 
  c.description, 
  c.activated, 
  c.cost, 
  c."created_at",
  (${relevanceSQL}) AS relevance,
  (Select name from "Categories" where "Categories".id = c.category ) as category,
  (
    SELECT CAST(COUNT(*) AS int)
    FROM "Subscriptions" s
    WHERE s."course_id" = c."id"
  ) AS users,
  (
    SELECT json_agg(row_to_json(cf))
    FROM (
      SELECT
        "file_name",
        "file_path",
        "id"
      FROM "CoursesFiles" cd
      WHERE "course_id" = c.id AND cd."file_type" ILIKE '%image%'
      ORDER BY "created_at" DESC Limit 3
    ) AS cf
  ) AS course_files,
   ${
       user_id
           ? `(
    CASE
      WHEN c.author = ${user_id} THEN TRUE
      WHEN EXISTS (
        SELECT 1
        FROM "Subscriptions" s2
        WHERE s2."course_id" = c.id
          AND s2."user_id" =${user_id}
      ) THEN TRUE
      ELSE FALSE
    END
  ) AS purchased`
           : ""
   }
FROM "Courses" c
WHERE 
  ${searchTerms
      .map(
          (term: string) => `
        (c.name ILIKE '%${term}%' OR c."description" ILIKE '%${term}%')
      `
      )
      .join(" OR ")}
  AND c.activated = true ${cat_id ? `AND c.category = ${cat_id}` : ""}
ORDER BY 
  ${relevanceSQL} DESC,
  c."created_at" DESC
LIMIT ${perPage}
OFFSET ${skip};
 `;

        // console.log(rawQuery);

        const response = await prisma.$transaction([
            prisma.courses.count({
                where,
            }),
            prisma.$queryRawUnsafe(rawQuery),
        ]);

        return res
            .status(200)
            .json({ courses: response[1], pages: Math.ceil(response[0] / Number(items_per_page)) });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};

export default getAllCourses;
