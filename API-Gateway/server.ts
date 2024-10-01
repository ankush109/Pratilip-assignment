import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schema";
import { resolvers } from "./resolver";
import express from "express";

const app = express();
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`API GATEWAY  is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer().catch(error => {
  console.error("Error starting server:", error);
});
