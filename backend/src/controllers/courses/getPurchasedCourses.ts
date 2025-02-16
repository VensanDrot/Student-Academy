import { Request, Response } from "express";
import { prisma } from "../../../prisma/index";
import { getDecodedToken } from "../../utils/getDecodedToken";

const getPurchasedCourses = async (req: Request, res: Response): Promise<any> => {
    const token = req.headers["x-access-token"] as string;
    const user_id = getDecodedToken(token);

    if (!user_id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Pagination (optional)
    const { page = "1", items_per_page = "10" } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const perPage = parseInt(items_per_page as string, 10) || 10;
    const skip = (pageNum - 1) * perPage;

    try {
        // 1) Count how many courses the user created or purchased
        const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM "Courses" c
      WHERE c.author = ${user_id}
        OR c.id IN (
          SELECT s."course_id"
          FROM "Subscriptions" s
          WHERE s."user_id" = ${user_id}
        )
    `;

        // 2) Fetch the actual courses
        //    We'll LEFT JOIN categories so we can return category name
        const coursesQuery = `
      SELECT
        c.id,
        c.name,
        cat.name AS category,
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
  ) AS course_files
      FROM "Courses" c
      LEFT JOIN "Categories" cat ON cat.id = c.category
      WHERE c.author = ${user_id}
        OR c.id IN (
          SELECT s."course_id"
          FROM "Subscriptions" s
          WHERE s."user_id" = ${user_id}
        )
      ORDER BY c."created_at" DESC
      LIMIT ${perPage}
      OFFSET ${skip}
    `;

        const [countResult, coursesResult]: any[] = await prisma.$transaction([
            prisma.$queryRawUnsafe(countQuery),
            prisma.$queryRawUnsafe(coursesQuery),
        ]);

        const total = Number(countResult[0].total);
        const totalPages = Math.ceil(total / perPage);

        return res.status(200).json({
            courses: coursesResult,
            pages: totalPages,
        });
    } catch (error: any) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export default getPurchasedCourses;
