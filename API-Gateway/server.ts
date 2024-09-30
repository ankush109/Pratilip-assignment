import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schema"
import resolvers from "./resolver";
import express from "express"
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Create an instance of Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }), // Pass the request object to context
});

// Start the Apollo Server
const startServer = async () => {
  await server.start(); // Await the server start

  // Apply Apollo GraphQL middleware to the Express app
  server.applyMiddleware({ app });

  // Start the Express server
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

// Call the startServer function
startServer().catch(error => {
  console.error("Error starting server:", error);
});