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

      
      const totalPrice = items.reduce((acc, item) => acc + item.price, 0);
      console.log(totalPrice, "totalPrice...");

      let total = 0;

      // Fetch product data for each item and handle insufficient stock
      const productData = await Promise.all(
        items.map(async (item) => {
          const productResponse = await axios.get(
            `http://localhost:6000/v1/product/get-product/${item?.productId}`
          );
          const product = productResponse.data.message;

          if (item.quantity > product.stock) {
            // If stock is insufficient, send a 401 response and stop execution
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

          // Calculate the total price for each item
          const itemTotalPrice = product.price * item.quantity;
          total += itemTotalPrice;

          return {
            ...item,
            price: product.price, // Set the product price from the Product Service
          };
        })
      );

      // Check if productData contains null values (in case of insufficient stock)
      if (!productData || productData.includes(null)) return;

      // Create the order in the database
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

      // Publish the event after the order is successfully created
      const message = {
        orderId: order.id,
        items: order.items,
        status: order.status,
        totalPrice: order.total,
      };
      await publishEvent(message, "ORDER_PLACED");

      // Send the success response
      res.json(customResponse(200, order));
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        // Send an error response only if the headers have not already been sent
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
  async getAllorders(   req: Request,
    res: Response,
    next: NextFunction){
  try{
   const allorders = await prisma.order.findMany({
    include:{
      items:true
    }
   })
   res.json(customResponse(200,allorders))
  }catch(err){
   
  }
  },
   async getAllorderById(   req: Request,
    res: Response,
    next: NextFunction){
  try{
    const {id}=req.params
   const order = await prisma.order.findMany({
    where:{
      id:id
    },
     include:{
      items:true
       
    }
   })
   console.log(order,"order")
   res.json(customResponse(200,order))
  }catch(err){
   
  }
  }
};

export default OrderController;
