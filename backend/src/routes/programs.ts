import { Router } from "express";
import { createProgram } from "../controllers/programs/createProgram";
import { deleteProgram } from "../controllers/programs/deleteProgram";
import { updateProgram } from "../controllers/programs/editProgram";

const programRoutes = Router();

programRoutes.delete("/:id", deleteProgram);
programRoutes.post("/add-program", createProgram);
programRoutes.patch("/edit-program", updateProgram);

export default programRoutes;
