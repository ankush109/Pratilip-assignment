import axios from "axios";

export const validateToken = async (req:any) => {
  console.log("Validating token");
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('Authorization token required');
  }
  const token = authHeader.split(" ")[1]; 
  console.log(token, "GraphQL token");
  try {
    
    const response = await axios.post('http://user-service:5000/v1/user/validate-token', { token });
    req.userId = response.data.message.message.user.id;
    console.log(response.data.message.message.user.id,"reposnse")
    
  } catch (error) {
   
    throw new Error('Invalid or expired token');
  }
};
