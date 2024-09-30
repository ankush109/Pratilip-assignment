import express, { type Router } from "express";
import { OrderController } from "../controllers";

const router: Router = express.Router();

router.post("/create-order", OrderController.createOrder);
router.patch("/update-status/:id",OrderController.orderStatus)

export default router;
