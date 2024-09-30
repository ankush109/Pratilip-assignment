import { PrismaClient } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import createError from "http-errors";
import {  registerSchema } from "../../schemas/index";
import bcrypt from "bcrypt";

import { customResponse } from "../utils/Response.util";
import { z, ZodError } from "zod";
import { publishEvent } from "../../app";
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
     
     const user =  await prisma.user.create({ data });
      const message = {
        name:user.name,
        id:user.id,
        email:user.email
      }
       await publishEvent(message,"user_registered");
      res.status(201).json(customResponse(201, user));
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
  async getAllusers(req: Request, res: Response, next: NextFunction){
  try{
 const allusers = await prisma.user.findMany({})
 res.json(customResponse(201,allusers))
  }catch(err){
    console.log(err)
  }
  },
  async getUserById(req: Request, res: Response, next: NextFunction){
      try{
  const {id} = req.params;
   const user = await prisma.user.findFirst({where:{id:id}})
   console.log(id,"iod")
   res.json(customResponse(201,user))
      }catch(err){
 console.log(err,"err")
      }
  }
};
