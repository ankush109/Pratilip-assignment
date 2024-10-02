import axios from 'axios';

const OrderService = {
 
  async getAllOrders() {
    const response = await axios.get('http://order-service:7000/v1/orders/get-all-orders');
    return response.data.message;
  },

  
  async getOrderById(id: string) {
    const response = await axios.get(`http://order-service:7000/v1/orders/get-order/${id}`);
    return response.data.message[0];
  },


  async placeOrder(input: any) {
    console.log(input,"ionput from order creation..")
    const response = await axios.post('http://order-service:7000/v1/orders/create-order', input);
   
    return {
      id: response.data.message.id,
      items: response.data.message.items,
    };
  }
};

export default OrderService;
