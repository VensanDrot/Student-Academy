import { Router } from "express";
import { createProgram } from "../controllers/programs/createProgram";
import { deleteProgram } from "../controllers/programs/deleteProgram";

const programRoutes = Router();

programRoutes.delete("/:id", deleteProgram);
programRoutes.post("/add-program", createProgram);

export default programRoutes;
