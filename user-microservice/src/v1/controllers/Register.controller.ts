import { PrismaClient } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import createError from "http-errors";
import {  registerSchema } from "../../schemas/index";
import bcrypt from "bcrypt";

import { customResponse } from "../utils/Response.util";
import { z, ZodError } from "zod";
const prisma = new PrismaClient();
type registerRequestBodyType = z.infer<typeof registerSchema>;
export const registerController = {
  async register(req: Request<{}, {}, registerRequestBodyType>, res: Response, next: NextFunction) {
    try {
      const resp = await registerSchema.parseAsync(req.body);
    //  console.log(res, "response..");
      const hashedPassword = await bcrypt.hash(
        resp.password,
       10
      );
      const data: any = {
        name:resp.name,
        email:resp.email,
        password: hashedPassword,
      };
      await prisma.user.create({ data });
      res.status(201).json(customResponse(201, "User Registered Successfully"));
    } catch (err) {
      console.log(err,"err")
      if (err instanceof ZodError) {
        return next({
          status: createError.InternalServerError().status,
          message: err.issues,
        });
      }
      return next(createError.InternalServerError());
    }
  },
};
