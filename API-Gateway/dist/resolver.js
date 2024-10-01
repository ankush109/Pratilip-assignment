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
exports.resolvers = void 0;
const withAuth_1 = __importDefault(require("./middlewares/withAuth"));
const orderService_1 = __importDefault(require("./services/orderService"));
const productService_1 = __importDefault(require("./services/productService"));
const redisClient_1 = require("./services/redisClient");
const userService_1 = __importDefault(require("./services/userService"));
exports.resolvers = {
    Query: {
        users: (0, withAuth_1.default)((_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const cacheKey = "users_list";
            try {
                const cachedUsers = yield redisClient_1.redisClient.get(cacheKey);
                if (cachedUsers) {
                    console.log("returning cached users ... ");
                    return JSON.parse(cachedUsers);
                }
                const users = yield userService_1.default.getAllUsers();
                yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(users), "EX", 600);
                console.log("users cached ... ");
                return users;
            }
            catch (err) {
                console.error("Error accessing Redis cache:", err);
                return yield userService_1.default.getAllUsers();
            }
        })),
        user: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return userService_1.default.getUserById(id);
        }),
        products: () => __awaiter(void 0, void 0, void 0, function* () {
            const cacheKey = "product_list";
            try {
                const cachedProducts = yield redisClient_1.redisClient.get(cacheKey);
                if (cachedProducts) {
                    console.log("Returning cached products");
                    console.log("in cache");
                    return JSON.parse(cachedProducts);
                }
                const products = yield productService_1.default.getAllProducts();
                yield redisClient_1.redisClient.set(cacheKey, JSON.stringify(products), "EX", 600); // Cache for 10 minutes
                console.log("Products cached");
                return products;
            }
            catch (err) {
                console.error("Error accessing Redis cache:", err);
                return yield productService_1.default.getAllProducts();
            }
        }),
        product: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return productService_1.default.getProductById(id);
        }),
        orders: () => __awaiter(void 0, void 0, void 0, function* () {
            const cache_key = "order_list";
            try {
                const cachedOrders = yield redisClient_1.redisClient.get(cache_key);
                if (cachedOrders) {
                    console.log("ORDERS FOUND IN CACHE.. ");
                    return JSON.parse(cachedOrders);
                }
                const orders = yield orderService_1.default.getAllOrders();
                yield redisClient_1.redisClient.set(cache_key, JSON.stringify(orders), "EX", 600);
                return orders;
            }
            catch (err) {
                console.error("Error accessing Redis cache:", err);
                return yield orderService_1.default.getAllOrders();
            }
        }),
        order: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return orderService_1.default.getOrderById(id);
        }),
    },
    Mutation: {
        registerUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
            return userService_1.default.registerUser(input);
        }),
        createProduct: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
            console.log("Deleting product cache...");
            yield redisClient_1.redisClient.del("product_list"); //   <- we are invalidating the redis cache when a new product is created
            console.log("Product cache deleted");
            return productService_1.default.createProduct(input);
        }),
        placeOrder: (0, withAuth_1.default)((_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
            yield redisClient_1.redisClient.del("order_list");
            return orderService_1.default.placeOrder(input);
        })),
        loginUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
            return userService_1.default.loginUser(input);
        }),
    },
};
