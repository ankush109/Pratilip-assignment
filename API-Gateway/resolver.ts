import axios from "axios";


const resolvers = {
  Query: {
    users: async () => {
      const response = await axios.get('http://localhost:5000/v1/user/users'); // User Service
      console.log(response,"response from API GATEWAY...")
      return response.data.message;
    },
    user: async (_: any, { id }: { id: string }) => {
      const response = await axios.get(`http://localhost:5000/v1/user/users/${id}`); // User Service
      return response.data.user;
    },
    products: async () => {
      const response = await axios.get('http://localhost:6000/v1/products'); // Product Service
      return response.data.products;
    },
    product: async (_: any, { id }: { id: string }) => {
      const response = await axios.get(`http://localhost:6000/v1/product/${id}`); // Product Service
      return response.data.product;
    },
    orders: async () => {
      const response = await axios.get('http://localhost:7000/v1/orders'); // Order Service
      return response.data.orders;
    },
    order: async (_: any, { id }: { id: string }) => {
      const response = await axios.get(`http://localhost:7000/v1/order/${id}`); // Order Service
      return response.data.order;
    }
  },

  Mutation: {
    registerUser: async (_: any, { input }: { input: any }) => {
      const response = await axios.post('http://localhost:5000/v1/auth/register', input); // User Servicec
      console.log(response.data.message,"register response")
      return response.data.message;
    },
    createProduct: async (_: any, { input }: { input: any }) => {
      const response = await axios.post('http://localhost:6000/v1/products', input); // Product Service
      return response.data.product;
    },
    placeOrder: async (_: any, { input }: { input: any }) => {
      const response = await axios.post('http://localhost:7000/v1/orders', input); // Order Service
      return response.data.order;
    }
  }
};

export default resolvers;
