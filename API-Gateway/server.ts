
import { ApolloServer } from "apollo-server";
import typeDefs from "./schema"
import resolvers from "./resolver";
const server = new ApolloServer({
  typeDefs,
  resolvers:resolvers,
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 GraphQL API Gateway running at ${url}`);
});
