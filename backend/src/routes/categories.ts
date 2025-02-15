import { Router } from "express";
import { getCategories } from "../controllers/categories/getCategories";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);

export default categoriesRouter;
