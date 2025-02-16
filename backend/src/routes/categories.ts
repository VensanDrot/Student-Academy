import { Router } from "express";
import { getCategories } from "../controllers/categories/getCategories";
import { getCategoriesCounted } from "../controllers/categories/getCountedCategories";
import { getPurchasedCounted } from "../controllers/categories/getPurchasedCategories";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.get("/active-categories", getCategoriesCounted);
categoriesRouter.get("/purchased-categories", getPurchasedCounted);

export default categoriesRouter;
