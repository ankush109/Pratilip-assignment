
import withAuth from './middlewares/withAuth';
import OrderService from './services/orderService';

import ProductService from './services/productService';
import UserService from './services/userService';

export const resolvers = {
  Query: {
    users: withAuth(async () => {
      return UserService.getAllUsers();
    }),
    user: async (_: any, { id }: { id: string }) => {
      return UserService.getUserById(id);
    },
    products: async () => {
      return ProductService.getAllProducts();
    },
    product: async (_: any, { id }: { id: string }) => {
      return ProductService.getProductById(id);
    },
    orders: async () => {
      return OrderService.getAllOrders();
    },
    order: async (_: any, { id }: { id: string }) => {
      return OrderService.getOrderById(id);
    }
  },

  Mutation: {
    registerUser: async (_: any, { input }: { input: any }) => {
      return UserService.registerUser(input);
    },
    createProduct: async (_: any, { input }: { input: any }) => {
      return ProductService.createProduct(input);
    },
    placeOrder: async (_: any, { input }: { input: any }) => {
      return OrderService.placeOrder(input);
    }
  }
};
