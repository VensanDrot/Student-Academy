import { Router } from "express";
import { createCourse } from "../controllers/courses/uploadCourseController";
import { getCourse } from "../controllers/courses/getCourse";
import { deleteCourse } from "../controllers/courses/deleteCourse";
import { updateCourse } from "../controllers/courses/updateCourseController";

const coursesRouter = Router();

coursesRouter.get("/course", getCourse);
coursesRouter.patch("/:id", updateCourse);
coursesRouter.delete("/:id", deleteCourse);
coursesRouter.post("/course", createCourse);

export default coursesRouter;
