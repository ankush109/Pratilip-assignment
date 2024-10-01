import axios from 'axios';

const UserService = {
  // Fetch all users -> 
  async getAllUsers() {
    const response = await axios.get('http://localhost:5000/v1/user/users');
    return response.data.message;
  },

  // Fetch user by ID ->
  async getUserById(id: string) {
    const response = await axios.get(`http://localhost:5000/v1/user/single-user/${id}`);
    return response.data.message;
  },

  // Register a new user ->
  async registerUser(input: any) {
    const response = await axios.post('http://localhost:5000/v1/auth/register', input);
    return response.data.message;
  }
};

export default UserService;
