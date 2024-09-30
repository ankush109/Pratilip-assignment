import express, { type Router } from "express";
import { loginController, ProfileController, registerController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router: Router = express.Router();

router.post("/profile",authMiddleware,ProfileController.createMyprofile);
router.get("/get-profile", authMiddleware,ProfileController.getMyProfile);
router.patch("/update-profile",authMiddleware,ProfileController.updateMyProfile)
router.get("/users",registerController.getAllusers)
router.get("/get-my-details",authMiddleware,ProfileController.getUserDetails)
router.post("/validate-token",loginController.validateJWTToken)
router.get("/single-user/:id",registerController.getUserById)
export default router;
