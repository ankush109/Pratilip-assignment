import express, { type Router } from "express";
import { ProfileController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router: Router = express.Router();

router.post("/profile",authMiddleware,ProfileController.createMyprofile);
router.get("/get-profile", authMiddleware,ProfileController.getMyProfile);
router.patch("/update-profile",authMiddleware,ProfileController.updateMyProfile)

export default router;
