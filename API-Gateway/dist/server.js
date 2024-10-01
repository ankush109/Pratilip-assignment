"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const schema_1 = __importDefault(require("./schema"));
const resolver_1 = require("./resolver");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: schema_1.default,
    resolvers: resolver_1.resolvers,
    context: ({ req }) => ({ req }),
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield server.start();
    server.applyMiddleware({ app });
    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`API GATEWAY  is running at http://localhost:${PORT}${server.graphqlPath}`);
    });
});
startServer().catch(error => {
    console.error("Error starting server:", error);
});
