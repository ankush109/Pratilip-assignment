import axios from 'axios';

const UserService = {

  async getAllUsers() {
    const response = await axios.get('http://user-service:5000/v1/user/users');
    return response.data.message;
  },


  async getUserById(id: string) {
    const response = await axios.get(`http://user-service:5000/v1/user/single-user/${id}`);
    return response.data.message;
  },

 
  async registerUser(input: any) {
    const response = await axios.post('http://user-service:5000/v1/auth/register', input);
    return response.data.message;
  },
  async loginUser(input: any) {
    const response = await axios.post('http://user-service:5000/v1/auth/login', input);
    return response.data.message;
  }

};

export default UserService;
