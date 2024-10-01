import { it, describe, expect, vi } from "vitest";
import { app } from "../../app";
import request from "supertest";
import { prismaClient } from "../__mocks__/db";
import { publishEvent } from "../publishers";


vi.mock("../db");
vi.mock("../publishers", () => ({
  publishEvent: vi.fn(),
}));

describe("Create Product", () => {
  it("Create a Product", async () => {
  
    prismaClient.product.create.mockResolvedValue({
      id: "1",
      name: "baots",
      description: "this is the best",
      price: 200,
      stock: 10,
      createdAt: new Date(),
    });

    const res = await request(app).post("/v1/product/create-product").send({
      name: "baots",
      description: "this is the best",
      price: 200,
      stock: 10,
    });

    
    expect(publishEvent).not.toHaveBeenCalled();

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      id: "1",
      name: "baots",
      description: "this is the best",
      price: 200,
      stock: 10,
    });
  });
});
