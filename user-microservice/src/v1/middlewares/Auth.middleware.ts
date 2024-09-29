
import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { JwtPayload } from "jsonwebtoken";
import JWTService from "../service/JWTService";
import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient()
const authMiddleware = async (req: any, _res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("in ")
    return next(createError.Unauthorized());
  }
 console.log(authHeader,"auth")
  const token = authHeader.split(" ")[1];
  console.log(token,"token from headers...")
  try {
    const User = JWTService.decode(token) as JwtPayload;
    const userId = User?.id;
  console.log(User,"user./")
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
  
    JWTService.verify(token, userId,process.env.USER_ACCESS_SECRET + user.password!) as { id: string };
    
    req.user = user;
    next();
  } catch (err) {
    console.log(err,"Erre")
    return next(createError.Unauthorized());
  }
};

export default authMiddleware;
