import { PrismaClient } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import createError from "http-errors";
import { customResponse } from "src/utils/Response.util";
import { z } from "zod";
const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
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
      await prisma.product.create({
        data: {
          name: resp.name,
          description: resp.description,
          price: resp.price,
        },
      });
      res.json(customResponse(200, "Product Created Successfully!"));
    } catch (err) {
      next(createError.InternalServerError());
    }
  },
};

export default ProductController;
