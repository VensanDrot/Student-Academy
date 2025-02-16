import { Router } from "express";
import bindCard from "../controllers/paymentMethods/bindcard";
import { getPaymentMethods } from "../controllers/paymentMethods/getCard";

const paymentRouter = Router();

paymentRouter.post("/bind-card", bindCard);
paymentRouter.get("/payment-methods", getPaymentMethods);

export default paymentRouter;
