import express, { type Router } from "express";
import { OrderController } from "../controllers";

const router: Router = express.Router();

router.post("/create-order", OrderController.createOrder);

export default router;
