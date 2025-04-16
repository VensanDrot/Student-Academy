import { Router } from "express";
import { registerUser } from "../controllers/auth/registrationController"; // Import registration controller
import { loginUser } from "../controllers/auth/loginController";
import { refreshToken } from "../controllers/auth/refreshController";
import { verifyUser } from "../controllers/auth/verifyUser";

const router = Router();

router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.get("/refresh", refreshToken);
router.post("/register", registerUser);

export default router;
