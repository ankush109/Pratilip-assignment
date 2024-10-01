import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

import { prismaClient } from '../__mocks__/db';

import { ZodError } from 'zod';

import { app } from '../app';

vi.mock('../db');


describe("ProfileController", () => {

  const mockUserMiddleware = (req: any, res: any, next: any) => {
    req.user = { id: "user-id-123" };
    next();
  };

  beforeEach(() => {
    app.use(mockUserMiddleware); 
  });

  describe("POST /profile", () => {
    it("should create a user profile", async () => {

      prismaClient.profile.create.mockResolvedValue({
        id: "profile-id-123",
        userId: "user-id-123",
        bio: "This is a test bio"
      });

      const res = await request(app).post("/profile").send({ bio: "This is a test bio" });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("profile created successfully!!");
      expect(prismaClient.profile.create).toHaveBeenCalledWith({
        data: {
          userId: "user-id-123",
          bio: "This is a test bio",
        },
      });
    });

    it("should return 500 if validation error occurs", async () => {
      const error = new ZodError([]); 
      prismaClient.profile.create.mockRejectedValue(error);

      const res = await request(app).post("/profile").send({ bio: "" });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toEqual(expect.arrayContaining(error.issues));
    });
  });

  describe("GET /profile", () => {
    it("should get the user profile", async () => {
      prismaClient.profile.findFirstOrThrow.mockResolvedValue({
        id: "profile-id-123",
        userId: "user-id-123",
        bio: "This is a test bio",
      });

      const res = await request(app).get("/profile").send();

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toEqual({
        id: "profile-id-123",
        userId: "user-id-123",
        bio: "This is a test bio",
      });
    });

    it("should return 500 if profile is not found", async () => {
      prismaClient.profile.findFirstOrThrow.mockRejectedValue(new Error("Profile not found"));

      const res = await request(app).get("/profile").send();

      expect(res.statusCode).toBe(500);
    });
  });


});
