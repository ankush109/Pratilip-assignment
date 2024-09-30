import express, { type Router } from "express";
import { OrderController } from "../controllers";

const router: Router = express.Router();

router.post("/create-order", OrderController.createOrder);
router.patch("/update-status/:id",OrderController.orderStatus)
router.get("/get-all-orders",OrderController.getAllorders)
router.get("/get-order/:id",OrderController.getAllorderById)
export default router;
