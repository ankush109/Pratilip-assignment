import axios from "axios";

export const validateToken = async (req:any) => {
  console.log("Validating token");
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('Authorization token required');
  }
  const token = authHeader; 
  console.log(token, "GraphQL token");
  try {
    
    const response = await axios.post('http://localhost:5000/v1/user/validate-token', { token });
    req.user = response.data.user;
   
  } catch (error) {
    console.error('Token validation error:', error);
    throw new Error('Invalid or expired token');
  }
};
