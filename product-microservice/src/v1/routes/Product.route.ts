import express, { type Router } from "express";
import { ProductController } from "../controllers";

const router: Router = express.Router();

router.post("/create-product", ProductController.createProduct);
router.patch("/update-product/:id", ProductController.updateProduct);
router.get("/get-product/:id", ProductController.getProductDetails);
router.get("/get-all-products", ProductController.getAllProducts);
router.delete("/delete-product/:id", ProductController.deleteProduct);
router.get("/get-product/:id",ProductController.getProductById)
export default router;
