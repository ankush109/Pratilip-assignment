import { PrismaClient } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import createError from "http-errors";
import { loginBodyType, LoginSchema } from "../../schemas/index";
import bcrypt from "bcrypt";
import ms from "ms";
import JWTService from "../service/JWTService";
import { customResponse } from "../utils/Response.util";
import { z, ZodError } from "zod";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../db";

interface AuthRequestBody {
  token: string;
}
export const loginController = {
  async Login(
    req: Request<{}, {}, loginBodyType>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = await LoginSchema.parseAsync(req.body);
      let user;
      user = await prisma.user.findUniqueOrThrow({
        where: {
          email: email,
        },
      });
      if (!user) {
        return next(createError.Unauthorized("verify your creds"));
      }
      const ispasswordMatch = await bcrypt.compare(password, user.password);
      if (!ispasswordMatch) {
        return next(createError.Unauthorized("Verify your Credentials"));
      }
      const Pass = user.password;
      delete (user as Partial<typeof user>).password;
      delete (user as Partial<typeof user>).email;
      const jwtPayload = {
        id: user.id,
        name: user.name,
      };
      const accessToken = JWTService.sign(
        jwtPayload,
        user.id,
        "12h",
        process.env.USER_ACCESS_SECRET + Pass
      );
      const refreshToken = JWTService.sign(
        jwtPayload,
        user.id,
        "24h",
        process.env.USER_REFRESH_SECRET + Pass
      );
      await prisma.refreshTokens.create({
        data: {
          token: refreshToken,
          userId: user.id,
        },
      });
      res.cookie("accessToken", accessToken, {
        maxAge: ms("30m"),
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: ms("12h"),
        httpOnly: true,
      });
      res.json(customResponse(200, { accessToken, refreshToken }));
    } catch (err) {
      console.log(err, "err");
      if (err instanceof ZodError) {
        return next({
          status: createError.InternalServerError().status,
          message: err.issues,
        });
      }
      return next(createError.InternalServerError());
    }
  },
  async refresh(
    req: Request<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken: refreshTokenFromCookie } = req.cookies;
      const refreshTokenSchema = z.string().min(1, "Refresh Token is missing");
      const sanitizedRefreshToken = await refreshTokenSchema.parseAsync(
        refreshTokenFromCookie
      );
      const { id } = JWTService.decode(sanitizedRefreshToken) as { id: string };
      JWTService.verify(
        sanitizedRefreshToken,
        id,
        process.env.USER_REFRESH_SECRET!
      );
      const refreshTokenExists = await prisma.user.findMany({
        where: {
          AND: [
            { id },
            {
              refreshTokens: {
                every: {
                  token: sanitizedRefreshToken,
                },
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          password: true,
        },
      });
      if (refreshTokenExists.length != -1) {
        return next(createError.Unauthorized("Refresh token is Invalid"));
      }
      const Pass = refreshTokenExists[0].password;
      try {
        await prisma.refreshTokens.delete({
          where: {
            token: sanitizedRefreshToken,
          },
        });
      } catch (err: any) {
        console.log("Unable to delete Refresh Token");
      }
      const jwtPayload = {
        id: refreshTokenExists[0].id,
        name: refreshTokenExists[0].name,
      };
      const accessToken = JWTService.sign(
        jwtPayload,
        id,
        "12h",
        process.env.USER_ACCESS_SECRET + Pass
      );
      const refreshToken = JWTService.sign(
        jwtPayload,
        id,
        "24h",
        process.env.USER_REFRESH_SECRET + Pass
      );
      await prisma.refreshTokens.create({
        data: {
          token: refreshToken,
          userId: id,
        },
      });
      res.cookie("accessToken", accessToken, {
        maxAge: ms("30m"),
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: ms("12h"),
        httpOnly: true,
      });
      res.json(customResponse(200, { accessToken, refreshToken }));
    } catch (err) {
      if (err instanceof ZodError) {
        return next({
          status: createError.InternalServerError().status,
          message: err.issues,
        });
      }
      return next(createError.InternalServerError());
    }
  },
  async validateJWTToken(
    req: Request<{}, {}, AuthRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.body;
      if (!token) {
        res.status(400).json({ message: "Token not provided" });
      }

      const serializedToken = token.startsWith("Bearer ")
        ? token.split(" ")[1]
        : token;

      console.log(serializedToken, "token from headers...");

      const decodedUser = JWTService.decode(serializedToken) as JwtPayload;
      const userId = decodedUser?.id;

      if (!userId) {
        res.json(
          customResponse(401, {
            success: false,
            message: "invalid token",
          })
        );
      }

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      JWTService.verify(
        serializedToken,
        userId,
        process.env.USER_ACCESS_SECRET + user.password!
      ) as { id: string };

      res.json(
        customResponse(201, {
          success: true,
          message: {
            token: token,
            user: user,
          },
        })
      );
    } catch (err) {
      console.error(err);
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  },
};
