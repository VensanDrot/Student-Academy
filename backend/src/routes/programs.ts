import { Router } from "express";
import bindCard from "../controllers/paymentMethods/bindcard";
import { getPaymentMethods } from "../controllers/paymentMethods/getCard";
import processPayment from "../controllers/paymentMethods/process";
import { createProgram } from "../controllers/programs/createProgram";

const programRoutes = Router();

programRoutes.post("/add-program", createProgram);

export default programRoutes;
