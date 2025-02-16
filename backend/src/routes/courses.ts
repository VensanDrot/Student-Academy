import { Router } from "express";
import { createCourse } from "../controllers/courses/uploadCourseController";
import { getCourse } from "../controllers/courses/getCourse";
import { deleteCourse } from "../controllers/courses/deleteCourse";
import { updateCourse } from "../controllers/courses/updateCourseController";
import getCreatedCourses from "../controllers/courses/getCreatedCourses";
import getAllCourses from "../controllers/courses/getAllCourses";
import getPurchasedCourses from "../controllers/courses/getPurchasedCourses";
import { getClientCourseDetails } from "../controllers/courses/getCourseDetails";
import { getCoursePreview } from "../controllers/courses/getCoursePreview";

const coursesRouter = Router();

coursesRouter.get("/course", getCourse);
coursesRouter.patch("/:id", updateCourse);
coursesRouter.delete("/:id", deleteCourse);
coursesRouter.post("/course", createCourse);
coursesRouter.get("/courses", getAllCourses);
coursesRouter.get("/course-details", getClientCourseDetails);
coursesRouter.get("/created-courses", getCreatedCourses);
coursesRouter.get("/purchased-courses", getPurchasedCourses);
coursesRouter.get("/preview-course", getCoursePreview);

export default coursesRouter;
