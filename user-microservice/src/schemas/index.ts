import { PrismaClient } from "@prisma/client";
import {z} from "zod"
const prisma = new PrismaClient();
const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .max(50, "Password must contain at most 50 characters")
  .trim();


export const emailSchema = z
  .string()
  .min(4, "Email must contain at least 4 characters")
  .max(60, "Email must contain at most 60 characters")
  .email("Please enter a valid email")
  .trim()
  .refine(
    async (email) => {
      try {
        await prisma.user.findUniqueOrThrow({
          where: {
            email,
          },
        });
        return false;
      } catch (err) {
        return true;
      }
    },
    {
      message: "Email already exists",
    }
  );

export const registerSchema =z
.object({
  name:z.string(),
  email:emailSchema,
  password:z.string()
})


export const LoginSchema =z.object({
    email:z.string(),
    password:passwordSchema
})


export type loginBodyType = z.infer<typeof LoginSchema>;