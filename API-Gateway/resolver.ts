import axios from "axios";
import withAuth from "./middlewares/withAuth";


const resolvers = {
  Query: {
    users: withAuth(async () => {
      const response = await axios.get('http://localhost:5000/v1/user/users'); // User Service
      console.log(response,"response from API GATEWAY...")
      return response.data.message;
    }),
  user: async (_: any, { id }: { id: string }) => {
  try {
    const response = await axios.get(`http://localhost:5000/v1/user/single-user/${id}`); // User Service
    console.log(response.data.message, "single-id");
    return response.data.message; // Return the user object instead of message
  } catch (error:any) {
    // Log only the message and any other useful information
    console.error("Error fetching user:", error)
   
  }
},

    products: async () => {
      const response = await axios.get('http://localhost:6000/v1/product/get-all-products'); // Product Service
      return response.data.message;
    },
    product: async (_: any, { id }: { id: string }) => {
      const response = await axios.get(`http://localhost:6000/v1/product/get-product/${id}`); // Product Service
      return response.data.message;
    },
    orders: async () => {
      const response = await axios.get('http://localhost:7000/v1/orders/get-all-orders'); // Order Service
      return response.data.message;
    },
    order: async (_: any, { id }: { id: string }) => {
      const response = await axios.get(`http://localhost:7000/v1/orders/get-order/${id}`); // Order Service
      console.log(response.data.message,"order from gateway")
      return response.data.message[0];
    }
  },

  Mutation: {
    registerUser: async (_: any, { input }: { input: any }) => {
      const response = await axios.post('http://localhost:5000/v1/auth/register', input); // User Servicec
      console.log(response.data.message,"register response")
      return response.data.message;
    },
    createProduct: async (_: any, { input }: { input: any }) => {
      const response = await axios.post('http://localhost:6000/v1/product/create-product', input); // Product Service
      console.log(response.data.message,"o")
      return response.data.message;
    },
    placeOrder: async (_: any, { input }: { input: any }) => {
      const response = await axios.post('http://localhost:7000/v1/orders/create-order', input); // Order Service
      console.log(response.data.message,"order placed...")
      return {
      id: response.data.message.id,
     
      items: response.data.message.items,
    };
    }
  }
};

export default resolvers;
