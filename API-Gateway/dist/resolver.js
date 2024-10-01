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
const userService_1 = __importDefault(require("./services/userService"));
exports.resolvers = {
    Query: {
        users: (0, withAuth_1.default)((_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return userService_1.default.getAllUsers();
        })),
        user: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return userService_1.default.getUserById(id);
        }),
        products: () => __awaiter(void 0, void 0, void 0, function* () {
            return productService_1.default.getAllProducts();
        }),
        product: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return productService_1.default.getProductById(id);
        }),
        orders: () => __awaiter(void 0, void 0, void 0, function* () {
            return orderService_1.default.getAllOrders();
        }),
        order: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return orderService_1.default.getOrderById(id);
        })
    },
    Mutation: {
        registerUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
            return userService_1.default.registerUser(input);
        }),
        createProduct: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
            return productService_1.default.createProduct(input);
        }),
        placeOrder: (0, withAuth_1.default)((_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
            return orderService_1.default.placeOrder(input);
        })),
        loginUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
            return userService_1.default.loginUser(input);
        })
    }
};
