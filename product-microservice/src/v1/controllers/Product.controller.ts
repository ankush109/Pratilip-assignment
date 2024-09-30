import { PrismaClient } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import createError from "http-errors";
import { customResponse } from "../../utils/Response.util";

import { z } from "zod";
import { publishEvent } from "../publishers";
const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock:z.number()
});
const prisma = new PrismaClient();
const ProductController = {
  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //  const {name,description,price} =req.body;
      const resp = await ProductSchema.parseAsync(req.body);
    const product =   await prisma.product.create({
        data: {
          name: resp.name,
          description: resp.description,
          price: resp.price,
          stock:resp.stock
        },
      });
      const message= {
        name:product.name,
        id:product.id,
        price:product.price,
        stoc:product.stock,
        description:product.description
      }
      await publishEvent(message,"product_created")
      res.json(customResponse(200, "Product Created Successfully!"));
      
    } catch (err) {
      next(createError.InternalServerError());
    }
  },
    async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //  const {name,description,price} =req.body;
      const {id} =req.params
      const resp = await ProductSchema.parseAsync(req.body);
      const product = await prisma.product.update({
        where:{
          id:id
        },
        data:{
          name: resp.name,
          description: resp.description,
          price: resp.price,
          stock:resp.stock

        }
      });
      const message= {
        name:product.name,
        id:product.id,
        price:product.price,
        stoc:product.stock,
        description:product.description
      }
      await publishEvent(message,"product_updated")
      res.json(customResponse(200, "Product Updated Successfully!"));
    } catch (err) {
      next(createError.InternalServerError());
    }
  },
     async getProductDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //  const {name,description,price} =req.body;
      const {id} =req.params
      
      const product = await prisma.product.findUniqueOrThrow({
        where:{
          id:id
        },
       
      });
      res.json(customResponse(200, product));
    } catch (err) {
      next(createError.InternalServerError());
    }
  },
   async getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
   
      const products = await prisma.product.findMany({});
      res.json(customResponse(200, products));
    } catch (err) {
      next(createError.InternalServerError());
    }
  },
    async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
     const {id} = req.params
       await prisma.product.delete({
        where:{
          id:id
        }
      });
      res.json(customResponse(200, "product deleted successfully!"));
    } catch (err) {
      next(createError.InternalServerError());
    }
  },
};

export default ProductController;
