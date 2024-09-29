import express, { type Router } from "express";
import { loginController,registerController } from "../controllers";


const router: Router = express.Router();

router.post("/login", loginController.Login);
router.post("/register", registerController.register);
export default router;
