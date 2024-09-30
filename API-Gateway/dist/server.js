"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const schema_1 = __importDefault(require("./schema"));
const resolver_1 = __importDefault(require("./resolver"));
const server = new apollo_server_1.ApolloServer({
    typeDefs: schema_1.default,
    resolvers: resolver_1.default,
});
server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀 GraphQL API Gateway running at ${url}`);
});
