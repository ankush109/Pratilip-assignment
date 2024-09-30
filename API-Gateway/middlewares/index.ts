import axios from "axios";

export const validateToken = async (req:any, res:any, next:any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token

  try {
    // Send the token to the User Microservice for validation
    const response = await axios.post('http://localhost:5000/v1/auth/validate', { token });
    req.user = response.data.user; // Attach user info to the request (if needed)

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token validation error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};