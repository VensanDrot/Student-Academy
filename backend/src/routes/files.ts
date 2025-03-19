import { Router } from "express";
import { createCourse } from "../controllers/courses/createCourse";
import { getCourse } from "../controllers/courses/getCourse";
import { getVideoChunk } from "../controllers/files/chunks";
import { getImage } from "../controllers/files/images";

const filesRouter = Router();

filesRouter.get("/download", getVideoChunk);
filesRouter.get("/download/:filename", getImage);

export default filesRouter;
