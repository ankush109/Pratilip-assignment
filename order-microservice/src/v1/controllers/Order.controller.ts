import { PrismaClient } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
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

      console.log(items, "items");
      const response = await axios.get(
        `http://user-service:5000/v1/user/getUserById/${userId}`
      );
      const user = response.data.message.profile;
      console.log(user, "user... ");
      let total = 0;

      const productData = await Promise.all(
        items.map(async (item) => {
          const productResponse = await axios.get(
            `http://product-service:6000/v1/product/get-product/${item?.productId}`
          );
          const product = productResponse.data.message;

          if (item.quantity > product.stock) {
            res
              .status(401)
              .json(
                customResponse(
                  401,
                  `${item?.productId} has insufficient stock.`
                )
              );
            throw new Error("Insufficient stock");
          }

          const itemTotalPrice = product.price * item.quantity;
          total += itemTotalPrice;

          return {
            ...item,
            price: product.price,
          };
        })
      );

      const order = await prisma.order.create({
        data: {
          userId,
          total,
          status: "PENDING",
          shippingAddress: user.shippingAddress,
          phoneNumber: user.phoneNumber,
          city: user.city,
          country: user.country,
          pincode: user.pincode,
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

      const message = {
        orderId: order.id,
        items: order.items,
        status: order.status,
        totalPrice: order.total,
      };
      await publishEvent(message, "ORDER_PLACED");

      res.json(customResponse(200, order));
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to create order" });
      }
    }
  },

  async orderStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const order = await prisma.order.findFirstOrThrow({
        where: {
          id: id,
        },
      });
      if (!order) {
        res.json(customResponse(201, "no order found with given Id"));
      }

      const orders = await prisma.order.update({
        where: {
          id: id,
        },
        data: {
          status: "SHIPPED",
        },
        include: {
          items: true,
        },
      });
      const message = {
        orderId: orders.id,
        items: orders.items,
        status: orders.status,
        totalPrice: orders.total,
      };
      await publishEvent(message, "order_shippeed");
      res.json(customResponse(201, "Order status has been updated .."));
    } catch (err) {
      console.log(err, "erre//");
    }
  },
  async getAllorders(req: Request, res: Response, next: NextFunction) {
    try {
      const allorders = await prisma.order.findMany({
        include: {
          items: true,
        },
      });
      res.json(customResponse(200, allorders));
    } catch (err) {}
  },
  async getAllorderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await prisma.order.findMany({
        where: {
          id: id,
        },
        include: {
          items: true,
        },
      });
      console.log(order, "order");
      res.json(customResponse(200, order));
    } catch (err) {}
  },
};

export default OrderController;
