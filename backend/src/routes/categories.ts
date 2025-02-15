import { Router } from "express";
import { getCategories } from "../controllers/categories/getCategories";
import { getCategoriesCounted } from "../controllers/categories/getCountedCategories";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.get("/active-categories", getCategoriesCounted);

export default categoriesRouter;
