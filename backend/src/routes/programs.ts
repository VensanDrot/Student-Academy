import { Router } from "express";
import { createProgram } from "../controllers/programs/createProgram";
import { deleteProgram } from "../controllers/programs/deleteProgram";
import { updateProgram } from "../controllers/programs/editProgram";
import { getClientLessonFull } from "../controllers/programs/getClientLesson";
import { getClientTestFull } from "../controllers/programs/getClientTest";
import { checkAnswers } from "../controllers/programs/submitTest";

const programRoutes = Router();

programRoutes.delete("/:id", deleteProgram);
programRoutes.get("/test", getClientTestFull);
programRoutes.get("/lesson", getClientLessonFull);
programRoutes.post("/add-program", createProgram);
programRoutes.patch("/edit-program", updateProgram);
programRoutes.post("/check-answers", checkAnswers);

export default programRoutes;
