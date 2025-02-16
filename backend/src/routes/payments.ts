import { Router } from "express";
import bindCard from "../controllers/paymentMethods/bindcard";
import { getPaymentMethods } from "../controllers/paymentMethods/getCard";
import processPayment from "../controllers/paymentMethods/process";

const paymentRouter = Router();

paymentRouter.post("/bind-card", bindCard);
paymentRouter.post("/proccess", processPayment);
paymentRouter.get("/payment-methods", getPaymentMethods);

export default paymentRouter;
