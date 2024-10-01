import axios from 'axios';


const ProductService = {
  // Fetch all products ->
  async getAllProducts() {
    const response = await axios.get('http://product-service:6000/v1/product/get-all-products');
    return response.data.message;
  },

  // Fetch product by ID ->
  async getProductById(id: string) {
    const response = await axios.get(`http://localhost:6000/v1/product/get-product/${id}`);
    return response.data.message;
  },

  // Create a new product ->
  async createProduct(input: any) {
    const response = await axios.post('http://localhost:6000/v1/product/create-product', input);
    return response.data.message;
  }
};

export default ProductService;
