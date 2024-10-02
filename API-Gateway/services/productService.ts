import axios from 'axios';


const ProductService = {

  async getAllProducts() {
    const response = await axios.get('http://product-service:6000/v1/product/get-all-products');
    return response.data.message;
  },

  async getProductById(id: string) {
    const response = await axios.get(`http://product-service:6000/v1/product/get-product/${id}`);
    return response.data.message;
  },


  async createProduct(input: any) {
    const response = await axios.post('http://product-service:6000/v1/product/create-product', input);
    return response.data.message;
  }
};

export default ProductService;
