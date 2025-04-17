import { Router } from "express";
import { deleteCourse } from "../controllers/courseSetup/deleteCourse";
import { updateCourse } from "../controllers/courseSetup/updateCourse";
import getCreatedCourses from "../controllers/courseSetup/getCreatedCourses";
import { createCourse } from "../controllers/courseSetup/createCourse";
import { getCourse } from "../controllers/courseSetup/getCourse";

const coursesSetupRouter = Router();

coursesSetupRouter.get("/course", getCourse);
coursesSetupRouter.patch("/:id", updateCourse);
coursesSetupRouter.delete("/:id", deleteCourse);
coursesSetupRouter.post("/course", createCourse);
// list of the courses that were created
coursesSetupRouter.get("/created-courses", getCreatedCourses);

export default coursesSetupRouter;
