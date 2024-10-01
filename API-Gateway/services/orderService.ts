import axios from 'axios';

const OrderService = {
  // Fetch all orders ->
  async getAllOrders() {
    const response = await axios.get('http://localhost:7000/v1/orders/get-all-orders');
    return response.data.message;
  },

  // Fetch order by ID ->
  async getOrderById(id: string) {
    const response = await axios.get(`http://localhost:7000/v1/orders/get-order/${id}`);
    return response.data.message[0];
  },

  // Place a new order ->
  async placeOrder(input: any) {
    const response = await axios.post('http://localhost:7000/v1/orders/create-order', input);
    return {
      id: response.data.message.id,
      items: response.data.message.items,
    };
  }
};

export default OrderService;
