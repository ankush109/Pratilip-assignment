import withAuth from "./middlewares/withAuth";
import OrderService from "./services/orderService";

import ProductService from "./services/productService";
import { redisClient } from "./services/redisClient";
import UserService from "./services/userService";

export const resolvers = {
  Query: {
    users: withAuth(async (_: any, args: any, context: any) => {
      return UserService.getAllUsers();
    }),
    user: async (_: any, { id }: { id: string }) => {
      return UserService.getUserById(id);
    },
    products: async () => {
      const cacheKey = "product_list";
      try {
        const cachedProducts = await redisClient.get(cacheKey);
        if (cachedProducts) {
          console.log("Returning cached products");
          console.log("in cache")
          return JSON.parse(cachedProducts);
        }
        const products = await ProductService.getAllProducts();
        await redisClient.set(cacheKey, JSON.stringify(products), 'EX', 600); // Cache for 10 minutes
        console.log('Products cached'); 
         return products;
      } catch (err) {
         console.error('Error accessing Redis cache:', err);
        return await ProductService.getAllProducts(); // Fallback to service call
      }
      
    },
    product: async (_: any, { id }: { id: string }) => {
      return ProductService.getProductById(id);
    },
    orders: async () => {
      return OrderService.getAllOrders();
    },
    order: async (_: any, { id }: { id: string }) => {
      return OrderService.getOrderById(id);
    },
  },

  Mutation: {
    registerUser: async (_: any, { input }: { input: any }) => {
      return UserService.registerUser(input);
    },
    createProduct: async (_: any, { input }: { input: any }) => {
      return ProductService.createProduct(input);
    },
    placeOrder: withAuth(async (_: any, { input }: { input: any }) => {
      return OrderService.placeOrder(input);
    }),
    loginUser: async (_: any, { input }: { input: any }) => {
      return UserService.loginUser(input);
    },
  },
};
