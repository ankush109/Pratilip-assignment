import { PrismaClient } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import createError from "http-errors";
import { customResponse } from "../../utils/Response.util";
import axios from "axios";
import { publishEvent } from "../producers";
const prisma = new PrismaClient();
const OrderController = {
  async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId, items } = req.body;
      const totalPrice = items.reduce((item, acc) => acc + item.price);
      console.log(totalPrice, "totalPrice...");
      let total = 0;

      // Fetch product data for each item
      const productData = await Promise.all(
        items.map(async (item) => {
          const productResponse = await axios.get(
            `http://localhost:6000/v1/product/get-product/${item.productId}`
          );
          const product = productResponse.data.message;
          //console.log(product.message,"ind")
          // Calculate the price based on the quantity and product price
          const itemTotalPrice = product.price * item.quantity;
          total += itemTotalPrice;

          return {
            ...item,
            price: product.price, // Set the product price from the Product Service
          };
        })
      );

      const order = await prisma.order.create({
        data: {
          userId,
          total,
          status: "PENDING",
          items: {
            create: productData.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });
      console.log(productData, "products data....");
      const message ={
        orderId:order.id,
        items:order.items,
        status:order.status,
        totalPrice:order.total
      }
      await publishEvent(message,"order_placed")
      res.json(customResponse(200, "Order has been placed successfully!"));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create order" });
    }
  },
};

export default OrderController;
