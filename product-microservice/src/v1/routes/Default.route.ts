import express, { type Router } from "express";
import { ProductController } from "../controllers";

const router: Router = express.Router();

router.get("/", ProductController.createProduct);

export default router;
