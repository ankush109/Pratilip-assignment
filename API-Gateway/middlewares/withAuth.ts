//@ts-nocheck
import { validateToken } from "./index";

const withAuth = (resolver) => async (parent, args, context, info) => {
  try {
    await validateToken(context.req); // Only pass context.req
    return resolver(parent, args, context, info); // Call the original resolver
  } catch (error) {
    console.log(error, "Error in authentication");
    throw new Error("Not authenticated");
  }
};

export default withAuth;
